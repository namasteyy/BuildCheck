'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal as TerminalIcon,
  Copy,
  Check,
  Award,
  DollarSign,
  FileText,
  AlertCircle,
  ExternalLink,
  GitBranch,
} from 'lucide-react';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-400 text-xs font-mono space-y-2">
      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Loading Monaco IDE Sandbox...</span>
    </div>
  ),
});

interface CandidateJourneyProps {
  code: string;
  onCodeChange: (code: string) => void;
  isRunningTest: boolean;
  onRunTest: () => void;
  logs: { timestamp: string; type: string; message: string }[];
  testPassed: boolean;
  evsScore: number;
  escrowDisbursed: boolean;
  ndaAccepted: boolean;
  onNdaChange: (accepted: boolean) => void;
  taskClaimed: boolean;
  onClaimTask: () => void;
  onSwitchToRecruiter: () => void;
}

export const CandidateJourney: React.FC<CandidateJourneyProps> = ({
  code,
  onCodeChange,
  isRunningTest,
  onRunTest,
  logs,
  testPassed,
  evsScore,
  escrowDisbursed,
  ndaAccepted,
  onNdaChange,
  taskClaimed,
  onClaimTask,
  onSwitchToRecruiter,
}) => {
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length, isRunningTest]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* STEP 1: Profile & GitHub Vector Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm shadow-inner">
            KM
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-slate-100">
                Kabir Mehra (B.Tech CSE &apos;26 • IIIT Delhi)
              </h2>
              {/* Header Badges */}
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-950 text-slate-300 border border-slate-800">
                <svg className="w-3.5 h-3.5 text-slate-300 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub Connected (@kabir-dev)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </span>

              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>pgvector Skill Embedding Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Top 4% Vector Affinity &bull; Core Stack: Python 3.10, FastAPI, Redis, Distributed Locking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">EVS Index</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {evsScore} / 100
            </span>
          </div>
        </div>
      </div>

      {/* STEP 2: Task Claim & Micro-NDA Clickwrap */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  Step 2: Task Claim &amp; Micro-NDA Clickwrap
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                  ₹3,000 Stipend
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sprint: <strong>Payment Reconciliation API Sprint (₹3,000 Stipend)</strong> &bull; Estimated completion: ~1-2 hours.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-emerald-400 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
            Escrow ID: #VF-ESCROW-819
          </span>
        </div>

        {/* Clickwrap Agreement */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={ndaAccepted}
              onChange={(e) => onNdaChange(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-slate-950 bg-slate-900 cursor-pointer"
            />
            <span>
              I agree to the <strong>Mutual Micro-NDA &amp; IP Licensing Terms</strong> (All code created in trial remains IP of BuildCheck upon escrow disbursal).
            </span>
          </label>

          <button
            onClick={onClaimTask}
            disabled={!ndaAccepted}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              taskClaimed
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : ndaAccepted
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            {taskClaimed ? '✓ Workspace Unlocked' : 'Enter Sandboxed Workspace'}
          </button>
        </div>
      </div>

      {/* STEP 3: Monaco IDE Sandboxed Workspace & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Left Column: Monaco IDE */}
        <div className="h-[560px] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-slate-950/60">
          {/* Editor Header Bar */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h4 className="text-xs font-mono font-bold text-slate-100 flex items-center gap-2">
                <span>Sandboxed Workspace (solution.py)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  python 3.10
                </span>
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={onRunTest}
                disabled={isRunningTest || !taskClaimed}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isRunningTest
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-wait animate-pulse'
                    : taskClaimed
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isRunningTest ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run PyTest Suite &amp; Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0 bg-slate-950 relative">
            <Editor
              height="100%"
              language="python"
              defaultLanguage="python"
              value={code}
              onChange={(val) => onCodeChange(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 12.5,
                fontFamily: 'var(--font-mono), monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                padding: { top: 12, bottom: 12 },
                automaticLayout: true,
                tabSize: 4,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Deterministic Sandbox Runner</span>
            <span className="text-emerald-400">Piston v2 / Python 3.10</span>
          </div>
        </div>

        {/* Right Column: Terminal Console */}
        <div className="h-[560px] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-slate-950/60">
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-mono font-semibold text-slate-200">
                Piston Sandbox Terminal
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              https://emkc.org/api/v2/piston/execute
            </span>
          </div>

          {/* Black Terminal Body */}
          <div className="flex-1 bg-black p-4 font-mono text-xs overflow-y-auto space-y-1.5 select-text border-b border-slate-800">
            <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-900 flex items-center justify-between select-none">
              <span>Isolated Environment: Python 3.10.0 (Linux x86_64)</span>
              <span className="text-emerald-400">READY</span>
            </div>

            {logs.map((log, index) => {
              let badgeColor = 'text-slate-400 bg-slate-900 border-slate-800';
              let textColor = 'text-slate-300';

              if (log.type === 'vector') {
                badgeColor = 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40';
                textColor = 'text-emerald-300 font-semibold';
              } else if (log.type === 'success') {
                badgeColor = 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30';
                textColor = 'text-emerald-400';
              } else if (log.type === 'warn') {
                badgeColor = 'text-amber-400 bg-amber-950/30 border-amber-500/30';
                textColor = 'text-amber-300';
              }

              return (
                <div key={index} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-600 select-none text-[10px] pt-0.5 whitespace-nowrap">
                    {log.timestamp}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border uppercase tracking-wider ${badgeColor}`}>
                    {log.type}
                  </span>
                  <span className={`flex-1 break-all ${textColor}`}>
                    {log.message}
                  </span>
                </div>
              );
            })}

            {isRunningTest && (
              <div className="py-2 px-3 my-2 rounded bg-slate-950 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                <span className="font-mono">
                  Provisioning isolated Docker container... Running automated test harness...
                </span>
              </div>
            )}

            <div ref={terminalEndRef} />
          </div>

          {/* Quick Metrics Bar */}
          <div className="p-3 bg-slate-950 grid grid-cols-3 gap-2">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Speed</span>
              <span className="text-xs font-bold text-slate-100 font-mono">98/100</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Test Coverage</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">100%</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Code Security</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">Passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 4: Verification, Bounty & Offer Banner */}
      {testPassed && (
        <div className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/50 border border-emerald-500/50 shadow-[0_0_25px_rgba(52,211,153,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(52,211,153,0.4)]">
              <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-base tracking-tight">
                  ✓ Deliverable Verified! ₹3,000 Paid Trial Stipend Disbursed • Fast-Track Offer Extended
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  OFFER READY
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 mt-0.5 leading-snug">
                All 18 chaos assertions passed in 0.14s. The hiring manager has extended a fast-track internship role and released the ₹3,000 INR trial honorarium via RazorpayX.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onSwitchToRecruiter}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              View Recruiter Dashboard &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
