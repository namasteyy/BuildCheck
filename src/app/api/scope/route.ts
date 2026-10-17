import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, difficulty = 'Junior', bounty = 3000 } = body;

    const p = (prompt || '').toLowerCase();

    let title = 'Payment Reconciliation API Latency Optimization';
    let techStack = ['Python 3.10', 'Redis', 'PyTest', 'FastAPI'];
    let description =
      'Optimize high-throughput batch invoice-to-payment reconciliation from O(n^2) nested scan to O(n) hash mapping while surviving concurrent webhook bursts.';
    let requirements = [
      'Implement reconcile_invoices(invoices, payments) returning matching invoice IDs.',
      'Achieve sub-2ms P99 execution for batches up to 10,000 transactions.',
      'Zero memory leaks under simulated memory pressure test.',
      'Pass all 18 automated idempotency and floating-point edge case tests.',
    ];
    let testCount = 18;

    if (p.includes('rate limit') || p.includes('sliding window') || p.includes('token bucket')) {
      title = 'Distributed Sliding Window Rate Limiter Engine';
      techStack = ['Go 1.23', 'Redis Lua', 'Concurrency', 'Chaos Testing'];
      description =
        'Implement an atomic sliding window rate limiter capable of sustaining 15,000 req/sec without race conditions or memory allocation spikes.';
      requirements = [
        'Atomic Redis Lua script with zero race condition vulnerability under concurrency.',
        'Goroutine chaos harness passing 1,000 concurrent threads without leaks.',
        'Sub-1.5ms P99 response time SLA under distributed load.',
        'Graceful 429 Retry-After header calculations matching standard RFC 6585.',
      ];
      testCount = 24;
    } else if (p.includes('k8s') || p.includes('kubernetes') || p.includes('terraform') || p.includes('infra') || p.includes('devops')) {
      title = 'Ephemeral Preview Clusters with TTL Janitor';
      techStack = ['Terraform', 'Kubernetes Helm', 'AWS EKS', 'Bash'];
      description =
        'Configure automated pull-request staging namespaces with strictly bounded resource quotas and automatic 4-hour TTL janitor cleanup.';
      requirements = [
        'Write modular Terraform configuration with CPU/memory resource quotas and network policies.',
        'Provide zero-drift plan output against mock AWS EKS cluster.',
        'Write shell janitor script terminating expired namespaces gracefully.',
        'Pass Trivy vulnerability scan with zero high/critical severity findings.',
      ];
      testCount = 14;
    } else if (p.includes('auth') || p.includes('jwt') || p.includes('rbac') || p.includes('security')) {
      title = 'Multi-Tenant RBAC Authorization Kernel';
      techStack = ['TypeScript', 'Node.js', 'JWT / JWKS', 'PostgreSQL'];
      description =
        'Build fine-grained role-based access control engine with cached hierarchical permission evaluation and tenant isolation guards.';
      requirements = [
        'Validate asymmetric RS256 JWT tokens against mock JWKS provider.',
        'Enforce strict tenant isolation: prevent IDOR cross-tenant access exploits.',
        'Sub-1ms permission bitmask evaluation cached in Redis.',
        'Audit trail emitter recording all permission denial incidents.',
      ];
      testCount = 20;
    } else if (prompt && prompt.trim().length > 10) {
      title = prompt.length > 55 ? prompt.slice(0, 52) + '...' : prompt;
      description = `Calibrated sandbox challenge derived from: "${prompt}". Designed to evaluate functional correctness, defensive programming, and refactoring performance under real production constraints.`;
      requirements = [
        `Implement core solution module handling all nominal and pathological boundary inputs.`,
        `Pass deterministic PyTest / Jest unit test harness with 100% assertion coverage.`,
        `Prevent memory leaks, unhandled exceptions, and algorithmic bottlenecks.`,
        `Document architectural rationale and AI code modifications in NOTES.md.`,
      ];
      testCount = 16;
    }

    const scopedTask = {
      id: `task-${Date.now().toString().slice(-4)}`,
      title,
      difficulty,
      bounty: Number(bounty) || 3000,
      techStack,
      description,
      requirements,
      testCount,
      timeLimitHours: 24,
    };

    return NextResponse.json({ success: true, task: scopedTask });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Scoper generation failed' },
      { status: 500 }
    );
  }
}
