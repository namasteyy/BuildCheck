'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Radar,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  DollarSign,
  ChevronRight,
  UserCheck,
  Database,
  ExternalLink,
  Code2,
  X,
} from 'lucide-react';

interface RecruiterJourneyProps {
  onSwitchToCandidate: () => void;
  escrowDisbursed: boolean;
  onDisburseEscrow: () => void;
}

export const RecruiterJourney: React.FC<RecruiterJourneyProps> = ({
  onSwitchToCandidate,
  escrowDisbursed,
  onDisburseEscrow,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [scoperInput, setScoperInput] = useState(
    'Optimize Payment Reconciliation API latency and handle concurrent webhook bursts.'
  );
  const [isScoping, setIsScoping] = useState(false);
  const [taskGenerated, setTaskGenerated] = useState(true);
  const [isInvited, setIsInvited] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const steps = [
    { number: 1, label: 'Backlog Scoper', shortDesc: 'AI Task Generator' },
    { number: 2, label: 'Vector Match Radar', shortDesc: 'pgvector Match' },
    { number: 3, label: 'Candidate Telemetry', shortDesc: 'Sandbox Review' },
    { number: 4, label: 'Offer & Escrow', shortDesc: '$150 Bounty Release' },
  ];

  const handleGenerateTask = () => {
    setIsScoping(true);
    setTimeout(() => {
      setIsScoping(false);
      setTaskGenerated(true);
      setCurrentStep(2);
    }, 900);
  };

  const handleInviteCandidate = () => {
    setIsInvited(true);
    setTimeout(() => {
      setCurrentStep(3);
    }, 400);
  };

  const handleReleaseOffer = () => {
    onDisburseEscrow();
    setShowOfferModal(true);
  };

  return (
    <div className="space-y-6">
      {/* 4-Step Interactive Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {steps.map((s, index) => {
            const isActive = currentStep === s.number;
            const isCompleted = currentStep > s.number || (s.number === 4 && escrowDisbursed);
            return (
              <React.Fragment key={s.number}>
                <button
                  onClick={() => setCurrentStep(s.number as any)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer text-left w-full md:w-auto flex-1 ${
                    isActive
                      ? 'bg-slate-950 border border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                      : isCompleted
                      ? 'bg-slate-950/60 border border-slate-800 text-slate-300'
                      : 'bg-slate-950/30 border border-slate-800/60 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-slate-100' : 'text-slate-300'
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {s.shortDesc}
                    </p>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden md:block w-4 h-4 text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content Area */}
      <div className="min-h-[500px]">
        {/* STEP 1: Backlog Scoper */}
        {currentStep === 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Step 1: AI Backlog Scoper
                  </h3>
                  <p className="text-xs text-slate-400">
                    Convert raw engineering backlog tickets into verifiable, sandboxed candidate tasks.
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                Autonomous Scoper v2.1
              </span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Backlog Engineering Ticket Prompt:
              </label>
              <textarea
                value={scoperInput}
                onChange={(e) => setScoperInput(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 leading-relaxed"
                placeholder="Describe the production engineering task..."
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Auto-escrow allocation: <strong>$150 USD</strong> locked upon candidate claim.</span>
              </div>

              <button
                onClick={handleGenerateTask}
                disabled={isScoping}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] cursor-pointer"
              >
                {isScoping ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Scoping Sandbox Task...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Generate Sandboxed Task with AI Scoper</span>
                  </>
                )}
              </button>
            </div>

            {taskGenerated && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Generated Task Specification: Payment Reconciliation API
                    </h4>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    Task #VF-8192
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase">Target Stack</span>
                    <p className="font-mono text-slate-200 mt-0.5">Python 3.10 • Redis • Pydantic</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase">Test Suite</span>
                    <p className="font-mono text-slate-200 mt-0.5">PyTest Automated Harness (O(n))</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase">Bounty Escrow</span>
                    <p className="font-mono text-emerald-400 font-bold mt-0.5">$150 Paid Trial Bounty</p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Proceed to Vector Match Radar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Vector Match Radar (pgvector) */}
        {currentStep === 2 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Radar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Step 2: Vector Match Radar (pgvector)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Matching verified candidate work graphs via 1,536-dimensional cosine embeddings in PostgreSQL.
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <Database className="w-3.5 h-3.5" />
                <span>HNSW index: cosine</span>
              </div>
            </div>

            {/* Matched Candidate Card */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg font-bold text-emerald-400 shadow-inner">
                    LM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100">
                        Leo M. (CS &apos;26)
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        @leom-dev
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      GitHub Work Graph: 42 public repos • 1,280+ commits • Distributed systems enthusiast
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">EVS Score</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">96 / 100</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                    94% Vector Match
                  </div>
                </div>
              </div>

              {/* Skills and similarity badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Stack Alignment</span>
                  <span className="font-semibold text-slate-200 font-mono">Python, FastAPI, Redis</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cosine Distance</span>
                  <span className="font-semibold text-emerald-400 font-mono">0.0588 (&lt;0.08)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sandbox Trial Status</span>
                  <span className="font-semibold text-emerald-300 font-mono">Eligible for Bounty</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-900">
                <p className="text-xs text-slate-400">
                  Sprint scope: <strong>24-Hour Sandboxed Trial</strong> with automatic test verification.
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleInviteCandidate}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Invite to 24-Hr Sandboxed Trial Sprint</span>
                  </button>
                  <button
                    onClick={onSwitchToCandidate}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                    title="Switch to candidate view"
                  >
                    Preview as Leo &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Candidate Telemetry & Sandbox Review */}
        {currentStep === 3 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Step 3: Candidate Telemetry & Sandbox Review
                  </h3>
                  <p className="text-xs text-slate-400">
                    Candidate Leo M. has completed the Payment Reconciliation API Sprint. Telemetry verified below.
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold font-mono">
                PASSING ALL GATES
              </span>
            </div>

            {/* 3 Live Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Unit Tests Passed (100%) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Unit Tests Passed
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-100 font-mono">
                    100%
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">
                    18 / 18 Assertions
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-full"></div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Passed idempotency, edge-case invoice rounding, and duplicate payment checks.
                </p>
              </div>

              {/* Card 2: Code Security (Passed - 0 Leaks) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Code Security
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-emerald-400 font-mono">
                    Passed
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    0 Leaks • 0 CVEs
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-full"></div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Zero memory leaks, AST safe, no unauthorized network requests in sandbox.
                </p>
              </div>

              {/* Card 3: Turnaround Speed (1.2 hrs) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Turnaround Speed
                  </span>
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-100 font-mono">
                    1.2 hrs
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">
                    P99 &lt; 1.42ms
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[92%]"></div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Delivered 22.8 hours ahead of the 24-hour sprint deadline with high velocity.
                </p>
              </div>
            </div>

            {/* Code Audit Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Solution Commit: <code>solution.py</code>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  SHA-256: 7f81a...92b1
                </span>
              </div>
              <pre className="p-3 rounded-lg bg-black text-slate-300 font-mono text-xs overflow-x-auto">
{`def reconcile_invoices(invoices, payments):
    # Optimized O(n) hashmap reconciliation
    payment_map = {pay['id']: pay['paid'] for pay in payments}
    return [inv['id'] for inv in invoices if payment_map.get(inv['id']) == inv['amt']]`}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] cursor-pointer"
              >
                <span>Proceed to Offer & Escrow Disbursal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Offer & Escrow Disbursal */}
        {currentStep === 4 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Step 4: Offer & Escrow Disbursal
                  </h3>
                  <p className="text-xs text-slate-400">
                    Release the $150 verified work bounty and extend a formal Fast-Track Full-Time offer.
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
                FINAL APPROVAL GATE
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    Candidate: Leo M. (CS &apos;26)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Role: Backend Engineering Intern &bull; Payment Infrastructure Squad
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">Escrow Vault</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">$150.00 USDC</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Escrow Contract:</span>
                  <span className="font-mono text-slate-200">0x819...vf_escrow_v2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deliverable Verification:</span>
                  <span className="text-emerald-400 font-semibold">100% Passed (PyTest & Sandbox Linter)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Offer Package:</span>
                  <span className="font-semibold text-slate-200">$48/hr + Relocation Housing Stipend</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReleaseOffer}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(52,211,153,0.4)] cursor-pointer"
                >
                  <DollarSign className="w-5 h-5 stroke-[2.5]" />
                  <span>Release $150 Escrow Bounty & Extend Fast-Track Offer</span>
                </button>
              </div>
            </div>

            {escrowDisbursed && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h5 className="text-xs font-bold text-white">
                      Offer Extended & $150 Disbursed to Candidate!
                    </h5>
                    <p className="text-[11px] text-emerald-300">
                      Candidate has been notified via email & GitHub. Bounty released from smart contract escrow.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="text-xs text-emerald-400 underline font-semibold cursor-pointer"
                >
                  View Receipt
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 shadow-2xl space-y-5 text-center relative">
            <button
              onClick={() => setShowOfferModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">
                Offer Extended & $150 Disbursed to Candidate!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dual-sided escrow completed successfully. The $150 bounty has been transferred to Leo M.&apos;s connected wallet and the Fast-Track employment package has been dispatched.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono text-xs space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Transaction:</span>
                <span className="text-emerald-400">#TX-9812481</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="text-slate-200 font-bold">$150.00 USDC</span>
              </div>
              <div className="flex justify-between">
                <span>Recipient:</span>
                <span className="text-slate-200">Leo M. (@leom-dev)</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow Status:</span>
                <span className="text-emerald-400">COMPLETED & RELEASED</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowOfferModal(false);
                onSwitchToCandidate();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Switch to Candidate View to View Disbursal &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
