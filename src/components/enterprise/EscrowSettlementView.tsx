'use client';

import React, { useState, useCallback } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  DollarSign,
  FileCheck,
  Lock,
  AlertTriangle,
  Loader2,
  Check,
  Clock,
  User,
  Activity,
  Hash,
  Info,
  Archive,
  X,
  MessageSquare,
} from 'lucide-react';
import { CandidateProfile, DisburseState, OfferPackage, EscrowRecord } from '../../types';
import { useToast } from '../common/Toast';

// ─────────────────────────────────────────────────────────────────────────────
// SHA-256 utility using native Web Crypto API (no dependencies)
// ─────────────────────────────────────────────────────────────────────────────
async function sha256Short(content: string): Promise<string> {
  const encoded = new TextEncoder().encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex.slice(0, 16) + '...';
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface DisburseResponse {
  success: boolean;
  transactionId: string;
  releasedAt: string;
  escrowId: string;
  confirmedAmount: number;
  provider: string;
}

interface AuditEntry {
  timestamp: string;
  type: 'info' | 'action' | 'success' | 'warn';
  message: string;
}

interface EscrowSettlementViewProps {
  candidate: CandidateProfile;
  offerPackage: OfferPackage;
  escrowRecord: EscrowRecord;
  onDisburseComplete: (record: EscrowRecord) => void;
  auditLog: AuditEntry[];
  onAddAuditEntry: (entry: AuditEntry) => void;
  onArchiveCandidate?: (candidateId: string, reason: string, notes: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// AuditTrailPanel
// ─────────────────────────────────────────────────────────────────────────────
const AuditTrailPanel: React.FC<{ entries: AuditEntry[] }> = ({ entries }) => {
  const typeConfig = {
    info: { color: 'text-slate-400', badge: 'text-slate-500 bg-slate-900 border-slate-800', label: 'INFO' },
    action: { color: 'text-blue-300', badge: 'text-blue-400 bg-blue-950/40 border-blue-500/30', label: 'ACTION' },
    success: { color: 'text-emerald-400', badge: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30', label: 'SUCCESS' },
    warn: { color: 'text-amber-300', badge: 'text-amber-400 bg-amber-950/30 border-amber-500/30', label: 'WARN' },
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Activity className="w-4 h-4 text-blue-400" />
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Transaction Audit Log
        </h3>
        <span className="ml-auto text-[10px] font-mono text-slate-500">Audit Trail Verified</span>
      </div>

      <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono">
        {entries.map((entry, i) => {
          const cfg = typeConfig[entry.type];
          return (
            <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
              <span className="text-slate-600 whitespace-nowrap pt-0.5">{entry.timestamp}</span>
              <span className={`px-1.5 py-0.5 rounded border text-[10px] uppercase tracking-wider shrink-0 ${cfg.badge}`}>
                {cfg.label}
              </span>
              <span className={cfg.color}>{entry.message}</span>
            </div>
          );
        })}
        {entries.length === 0 && (
          <p className="text-slate-500 text-xs py-2">No audit events yet.</p>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export const EscrowSettlementView: React.FC<EscrowSettlementViewProps> = ({
  candidate,
  offerPackage,
  escrowRecord,
  onDisburseComplete,
  auditLog,
  onAddAuditEntry,
  onArchiveCandidate,
}) => {
  const { showToast } = useToast();
  const [disburseState, setDisburseState] = useState<DisburseState>(
    escrowRecord.status === 'released' ? 'confirmed' : 'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedRecord, setConfirmedRecord] = useState<EscrowRecord>(escrowRecord);

  // Archive modal state
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveReason, setArchiveReason] = useState('High Algorithmic Latency / Memory Allocation');
  const [archiveNotes, setArchiveNotes] = useState('');
  const [isArchived, setIsArchived] = useState(false);

  const isDisbursed = disburseState === 'confirmed';

  // ── Step 1: Recruiter clicks "Release Escrow" → show confirm panel ─────────
  const handleInitiateDisburse = () => {
    setDisburseState('confirming');
    onAddAuditEntry({
      timestamp: new Date().toTimeString().split(' ')[0],
      type: 'action',
      message: 'Recruiter initiated disbursement review — awaiting confirmation.',
    });
  };

  // ── Step 2: Recruiter confirms → fire API call ─────────────────────────────
  const handleConfirmDisburse = useCallback(async () => {
    setDisburseState('processing');
    onAddAuditEntry({
      timestamp: new Date().toTimeString().split(' ')[0],
      type: 'action',
      message: `Disbursement confirmed. Sending ₹${offerPackage.trialBounty.toLocaleString('en-IN')}.00 via RazorpayX Escrow...`,
    });

    try {
      const res = await fetch('/api/escrow/disburse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: `SUB-${candidate.id.toUpperCase()}-001`,
          candidateId: candidate.id,
          amount: offerPackage.trialBounty,
        }),
      });

      const data: DisburseResponse & { error?: string } = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Disbursement failed');
      }

      // ── Compute real SHA-256 of the offer document content ────────────────
      const docContent = JSON.stringify({
        candidateName: candidate.name,
        offerRef: offerPackage.offerRef,
        position: offerPackage.position,
        trialBounty: offerPackage.trialBounty,
        transactionId: data.transactionId,
        issuedAt: data.releasedAt,
      });
      const documentHash = await sha256Short(docContent);

      const updatedRecord: EscrowRecord = {
        escrowId: data.escrowId,
        provider: 'razorpayx_escrow',
        status: 'released',
        confirmedAmount: data.confirmedAmount,
        transactionId: data.transactionId,
        releasedAt: data.releasedAt,
        documentHash,
      };

      setConfirmedRecord(updatedRecord);
      setDisburseState('confirmed');
      onDisburseComplete(updatedRecord);

      onAddAuditEntry({
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'success',
        message: `$${data.confirmedAmount}.00 released. Transaction: ${data.transactionId}`,
      });
      onAddAuditEntry({
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'success',
        message: 'DocuSign offer packet dispatched to candidate.',
      });

      showToast(
        'Escrow Disbursed & Offer Released',
        `$${data.confirmedAmount}.00 sent to ${candidate.name}. Txn: ${data.transactionId}`,
        'success'
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setDisburseState('error');
      onAddAuditEntry({
        timestamp: new Date().toTimeString().split(' ')[0],
        type: 'warn',
        message: `Disbursement error: ${err.message}`,
      });
      showToast('Disbursement Error', err.message, 'error');
    }
  }, [candidate, offerPackage, onDisburseComplete, onAddAuditEntry, showToast]);

  const handleRetry = () => {
    setErrorMessage(null);
    setDisburseState('idle');
  };

  const handleConfirmArchive = () => {
    setIsArchived(true);
    setShowArchiveModal(false);
    const time = new Date().toTimeString().split(' ')[0];
    onAddAuditEntry({
      timestamp: time,
      type: 'warn',
      message: `Candidate ${candidate.name} archived. Reason: ${archiveReason}. Notes: ${archiveNotes || 'No additional notes provided.'}`,
    });
    if (onArchiveCandidate) {
      onArchiveCandidate(candidate.id, archiveReason, archiveNotes);
    }
    showToast(
      'Candidate Archived with Feedback',
      `${candidate.name} archived with reason: "${archiveReason}". Constructive notes logged.`,
      'info'
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
              Dual-Sided Escrow &amp; Fast-Track Offer Desk
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Server-gated settlement: disbursement only releases after deterministic test gates are verified server-side.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Escrow Vault</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {isDisbursed
                ? `$${confirmedRecord.confirmedAmount}.00 Released`
                : isArchived
                ? 'Candidate Archived'
                : `$${offerPackage.trialBounty}.00 Locked`}
            </span>
          </div>
          <div className={`w-2 h-2 rounded-full ${isDisbursed ? 'bg-emerald-400' : isArchived ? 'bg-slate-600' : 'bg-amber-400 animate-pulse'}`} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ── Left Column: Disbursement Action ── */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Candidate Settlement</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {candidate.testPassRate} Passed
            </span>
          </div>

          {/* Candidate Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-xs">
              {candidate.avatar}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{candidate.name}</h4>
              <p className="text-xs text-slate-400">{candidate.role} &bull; {candidate.handle}</p>
            </div>
          </div>

          {/* Financial Details */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Trial Honorarium:</span>
              <span className="text-emerald-400 font-bold font-mono">
                ₹{offerPackage.trialBounty.toLocaleString('en-IN')}.00 INR
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Escrow Provider:</span>
              <span className="text-slate-300">RazorpayX Bank Escrow</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Escrow Reference:</span>
              <span className="text-slate-300 font-mono">
                {confirmedRecord.escrowId || offerPackage.offerRef.replace('OFFER', 'ESC')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Deliverable Verification:</span>
              <span className="text-emerald-400 font-mono">{candidate.testPassRate} Tests Passed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Disbursement Status:</span>
              <span className={isDisbursed ? 'text-emerald-400 font-bold' : isArchived ? 'text-slate-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {isDisbursed ? 'RELEASED TO CANDIDATE' : isArchived ? 'ARCHIVED' : 'READY FOR RELEASE'}
              </span>
            </div>
            {confirmedRecord.transactionId && (
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  {confirmedRecord.transactionId}
                </span>
              </div>
            )}
          </div>

          {/* ── Disbursement State Machine & Actions ── */}
          {disburseState === 'idle' && !isArchived && (
            <div className="space-y-2.5">
              <button
                onClick={handleInitiateDisburse}
                aria-label={`Release ₹${offerPackage.trialBounty.toLocaleString('en-IN')} INR trial honorarium to ${candidate.name} and extend formal offer`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
              >
                <DollarSign className="w-4 h-4 stroke-[2.5]" />
                <span>Release ₹{offerPackage.trialBounty.toLocaleString('en-IN')} Honorarium &amp; Extend Offer</span>
              </button>

              <button
                onClick={() => setShowArchiveModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5 text-slate-400" />
                <span>Archive with Feedback</span>
              </button>
            </div>
          )}

          {isArchived && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <span className="text-slate-400 font-bold block">Candidate Record Archived:</span>
              <p className="text-slate-300">Reason: {archiveReason}</p>
              {archiveNotes && <p className="text-slate-400 text-[11px]">"{archiveNotes}"</p>}
              <button
                onClick={() => setIsArchived(false)}
                className="text-[11px] text-emerald-400 hover:underline pt-1 cursor-pointer"
              >
                Restore Candidate Record
              </button>
            </div>
          )}

          {/* CONFIRMING: 2-step confirmation panel */}
          {disburseState === 'confirming' && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-300">This action is irreversible.</p>
                  <p className="text-xs text-amber-400/80 mt-1">You are about to:</p>
                </div>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-1">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Release <strong className="text-emerald-400">₹{offerPackage.trialBounty.toLocaleString('en-IN')}.00 INR</strong> to {candidate.name} via RazorpayX
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Generate &amp; dispatch DocuSign offer packet
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Record transaction on immutable audit log
                </li>
              </ul>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setDisburseState('idle')}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDisburse}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
                >
                  Confirm &amp; Release
                </button>
              </div>
            </div>
          )}

          {/* PROCESSING: RazorpayX spinner */}
          {disburseState === 'processing' && (
            <div className="flex items-center justify-center gap-3 py-4 rounded-xl bg-slate-950 border border-slate-800">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="text-xs font-mono text-emerald-300">
                Processing via RazorpayX Escrow...
              </span>
            </div>
          )}

          {/* CONFIRMED: Success receipt */}
          {disburseState === 'confirmed' && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-xs font-bold text-emerald-300">
                  ₹{confirmedRecord.confirmedAmount ? confirmedRecord.confirmedAmount.toLocaleString('en-IN') : offerPackage.trialBounty.toLocaleString('en-IN')}.00 Disbursed &amp; Offer Extended
                </p>
              </div>
              {confirmedRecord.transactionId && (
                <p className="text-[11px] font-mono text-slate-400 pl-6">
                  {confirmedRecord.transactionId}
                </p>
              )}
              {confirmedRecord.releasedAt && (
                <p className="text-[11px] text-slate-500 pl-6 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(confirmedRecord.releasedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* ERROR: Retry panel */}
          {disburseState === 'error' && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-300">Disbursement Failed</p>
                  <p className="text-xs text-red-400/80 mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                className="w-full py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* ── Right Column: Formal Offer Letter ── */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Formal Fast-Track Offer Package
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Ref: {offerPackage.offerRef}
            </span>
          </div>

          {/* Letter */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-sans space-y-4 text-xs leading-relaxed">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-100">
                  BuildCheck Enterprise &bull; Talent Verification
                </h4>
                <p className="text-[11px] text-slate-400">Verified Engineering Work Trials</p>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  isDisbursed
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : isArchived
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {isDisbursed ? 'OFFER EXTENDED' : isArchived ? 'ARCHIVED' : 'PENDING DISBURSEMENT'}
                </span>
              </div>
            </div>

            <p>
              Dear <strong>{candidate.name}</strong>,
            </p>
            <p>
              Following your successful completion of the <strong>{candidate.taskName}</strong> sprint (
              {candidate.testPassRate} automated test suites passed, zero security vulnerabilities,
              and {candidate.evsScore}/100 composite Engineering Verification Score), we are pleased to extend
              a formal fast-track offer to join our engineering organization.
            </p>

            {/* Financial Terms Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Position</span>
                <span className="font-bold text-slate-200">{offerPackage.position}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Compensation</span>
                <span className="font-bold text-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  {offerPackage.hourlyRate}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Trial Honorarium</span>
                <span className="font-bold text-emerald-400 font-mono">
                  ₹{offerPackage.trialBounty.toLocaleString('en-IN')}.00 INR
                  {isDisbursed ? ' (Disbursed)' : ' (Pending)'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Start Date</span>
                <span className="font-bold text-slate-200">{offerPackage.startDate}</span>
              </div>
            </div>

            {/* Compensation lock notice */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Specific compensation figures are disclosed directly to the candidate upon formal offer acceptance per BuildCheck policy BC-HR-003.
              </span>
            </div>

            {/* Document footer */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono flex items-center gap-1">
                <Hash className="w-3 h-3 text-slate-500" />
                {confirmedRecord.documentHash
                  ? `SHA-256: ${confirmedRecord.documentHash}`
                  : 'SHA-256: — pending disbursement'}
              </span>
              <span className={`flex items-center gap-1 ${isDisbursed ? 'text-emerald-400' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isDisbursed ? 'DocuSign Dispatched' : 'Awaiting Release'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail Panel */}
      <AuditTrailPanel entries={auditLog} />

      {/* Archive with Feedback Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Archive Candidate with Feedback
                </h3>
              </div>
              <button
                onClick={() => setShowArchiveModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Provide structured engineering rationale for archiving <strong className="text-slate-100">{candidate.name}</strong>:
              </p>

              <div className="space-y-2">
                {[
                  'High Algorithmic Latency / Memory Allocation',
                  'Security Vulnerability Unaddressed in Sandbox',
                  'Sub-Optimal AI Refactoring & Prompts Ratio',
                  'Position Filled / Headcount Reallocated',
                  'Other Architectural Disqualification',
                ].map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 cursor-pointer hover:border-slate-700"
                  >
                    <input
                      type="radio"
                      name="archive_reason"
                      checked={archiveReason === reason}
                      onChange={() => setArchiveReason(reason)}
                      className="accent-emerald-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Constructive Feedback Notes (Sent to candidate):</span>
                </label>
                <textarea
                  value={archiveNotes}
                  onChange={(e) => setArchiveNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Solution passed nominal test cases but memory allocation exceeded bounds under high-throughput burst simulation..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 font-mono resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Confirm &amp; Archive Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
