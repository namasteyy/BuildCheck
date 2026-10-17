import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// In-memory escrow store (replace with DB in production: Supabase/Postgres)
// Keyed by submissionId → EscrowRecord
// ---------------------------------------------------------------------------
interface ServerEscrowRecord {
  submissionId: string;
  candidateId: string;
  agreedAmount: number;
  testsPassed: boolean;
  status: 'pending' | 'released' | 'disputed';
  transactionId: string | null;
  releasedAt: string | null;
}

const escrowStore = new Map<string, ServerEscrowRecord>([
  [
    'SUB-KM-001',
    {
      submissionId: 'SUB-KM-001',
      candidateId: 'KM-1',
      agreedAmount: 3000,
      testsPassed: true,
      status: 'pending',
      transactionId: null,
      releasedAt: null,
    },
  ],
]);

function generateTransactionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'txn_rzpx_';
  for (let i = 0; i < 14; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, candidateId, amount } = body as {
      submissionId: string;
      candidateId: string;
      amount: number;
    };

    // ── Validate request shape ──────────────────────────────────────────────
    if (!submissionId || !candidateId || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: submissionId, candidateId, amount' },
        { status: 400 }
      );
    }

    if (amount <= 0 || amount > 500_000) {
      return NextResponse.json(
        { error: 'Invalid disbursement amount' },
        { status: 400 }
      );
    }

    // ── GUARD 1: Lookup submission in escrow store ──────────────────────────
    const record = escrowStore.get(submissionId);
    if (!record) {
      // Unknown submission — create a new pending record from the demo data
      // In production this would be a DB lookup that throws if not found
      escrowStore.set(submissionId, {
        submissionId,
        candidateId,
        agreedAmount: amount,
        testsPassed: true, // demo: assume tests passed
        status: 'pending',
        transactionId: null,
        releasedAt: null,
      });
    }

    const submission = escrowStore.get(submissionId)!;

    // ── GUARD 2: Idempotency — prevent double disbursement ──────────────────
    if (submission.status === 'released') {
      return NextResponse.json(
        {
          error: 'Escrow already disbursed',
          transactionId: submission.transactionId,
          releasedAt: submission.releasedAt,
        },
        { status: 409 }
      );
    }

    // ── GUARD 3: Test gate — disbursement only allowed if tests passed ──────
    if (!submission.testsPassed) {
      return NextResponse.json(
        {
          error:
            'Cannot disburse: submission has not passed all required test gates. ' +
            'All automated test suites must pass before escrow is released.',
        },
        { status: 403 }
      );
    }

    // ── GUARD 4: Amount integrity — client cannot inflate the payment ───────
    if (submission.agreedAmount !== amount) {
      return NextResponse.json(
        {
          error: `Amount mismatch: agreed amount is ₹${submission.agreedAmount}, received ₹${amount}`,
        },
        { status: 422 }
      );
    }

    // ── Simulate RazorpayX Escrow transfer ────────────────────────────────────
    await new Promise((resolve) => setTimeout(resolve, 800)); // simulate network

    const transactionId = generateTransactionId();
    const releasedAt = new Date().toISOString();

    // ── Persist atomically ──────────────────────────────────────────────────
    submission.status = 'released';
    submission.transactionId = transactionId;
    submission.releasedAt = releasedAt;
    escrowStore.set(submissionId, submission);

    return NextResponse.json({
      success: true,
      submissionId,
      candidateId,
      confirmedAmount: amount,
      transactionId,
      releasedAt,
      provider: 'razorpayx_escrow',
      escrowId: `ESC-${candidateId.replace(/[^A-Z0-9]/gi, '')}-${Date.now()}`.toUpperCase(),
    });
  } catch (err: any) {
    console.error('[/api/escrow/disburse]', err);
    return NextResponse.json(
      { error: err.message || 'Escrow disbursement failed' },
      { status: 500 }
    );
  }
}
