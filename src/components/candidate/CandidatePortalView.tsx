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
  Code2,
  ExternalLink,
} from 'lucide-react';
import { CandidateProfile } from '../../types';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-400 text-xs font-mono space-y-2">
      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Initializing Monaco Developer Environment...</span>
    </div>
  ),
});

interface CandidatePortalViewProps {
  candidate: CandidateProfile;
  code: string;
  onCodeChange: (code: string) => void;
  isRunningTest: boolean;
  onRunTest: () => void;
  logs: { timestamp: string; type: string; message: string }[];
  testPassed: boolean;
  evsScore: number;
  escrowDisbursed: boolean;
  onSwitchToEnterprise: () => void;
}

export const CandidatePortalView: React.FC<CandidatePortalViewProps> = ({
  candidate,
  code,
  onCodeChange,
  isRunningTest,
  onRunTest,
  logs,
  testPassed,
  evsScore,
  escrowDisbursed,
  onSwitchToEnterprise,
}) => {
  const [copied, setCopied] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(true);
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Candidate Identity & Vector Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-emerald-400 text-base shadow-inner">
            {candidate.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-100">
                {candidate.name}
              </h2>
              {/* GitHub Badge */}
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-950 text-slate-300 border border-slate-800">
                <svg className="w-3.5 h-3.5 text-slate-300 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub Connected ({candidate.handle})</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </span>

              {/* pgvector Status */}
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>pgvector Skill Embedding Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Top 4% Vector Affinity &bull; {candidate.education} &bull; Stack: Python, FastAPI, Redis, Distributed Locking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">EVS Index</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {evsScore} / 100
            </span>
          </div>
        </div>
      </div>

      {/* 2. Claimed Bounty Sprint & Micro-NDA Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  {candidate.taskName}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                  ${candidate.bounty} USDC Bounty
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sponsored by <strong>Stripe Labs</strong> &bull; 24-hr trial window &bull; Guaranteed payment upon passing automated test harness.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-emerald-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            Escrow ID: #VF-ESCROW-819
          </span>
        </div>

        {/* Micro-NDA Clickwrap */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={ndaAccepted}
              onChange={(e) => setNdaAccepted(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-slate-950 bg-slate-900 cursor-pointer"
            />
            <span>
              I agree to the <strong>Mutual Micro-NDA &amp; IP Licensing Terms</strong> (Code is verified in sandbox and licensed upon bounty disbursement).
            </span>
          </label>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            ✓ Workspace Unlocked
          </span>
        </div>
      </div>

      {/* 3. Developer Monaco IDE & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Editor (7 cols) */}
        <div className="lg:col-span-7 h-[600px] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-mono font-bold text-slate-200">
                solution.py
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                python 3.10
              </span>
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
                    <span className="text-emerald-400 text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={onRunTest}
                disabled={isRunningTest || !ndaAccepted}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isRunningTest
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-wait animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                }`}
              >
                {isRunningTest ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing Sandbox...</span>
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

          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Deterministic Test Runner</span>
            <span className="text-emerald-400 font-semibold">PyTest Suite Bound</span>
          </div>
        </div>

        {/* Terminal (5 cols) */}
        <div className="lg:col-span-5 h-[600px] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                Execution Terminal
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Piston v2 / Python 3.10
            </span>
          </div>

          <div className="flex-1 bg-black p-4 font-mono text-xs overflow-y-auto space-y-1.5 select-text border-b border-slate-800">
            <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-900 flex items-center justify-between select-none">
              <span>Candidate Container Environment (Linux x86_64)</span>
              <span className="text-emerald-400">ONLINE</span>
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
              <div className="py-2.5 px-3 my-2 rounded bg-slate-950 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                <span className="font-mono">
                  Provisioning isolated Docker container... Running automated test harness...
                </span>
              </div>
            )}

            <div ref={terminalEndRef} />
          </div>

          {/* Telemetry Summary */}
          <div className="p-4 bg-slate-950 grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Speed</span>
              <span className="text-xs font-bold text-slate-100 font-mono">98/100</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Coverage</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">100%</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Security</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">Passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Verification & Offer Banner */}
      {testPassed && (
        <div className="w-full p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/50 border border-emerald-500/50 shadow-[0_0_25px_rgba(52,211,153,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(52,211,153,0.4)]">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-base tracking-tight">
                  ✓ Deliverable Verified! $150 Paid Trial Bounty Disbursed • Fast-Track Offer Extended
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  DISBURSED
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 mt-1 leading-snug">
                All 18 chaos assertions passed in 0.14s. The hiring manager has extended a fast-track full-time role and released the $150 USDC trial bounty to your wallet.
              </p>
            </div>
          </div>

          <button
            onClick={onSwitchToEnterprise}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Switch to Enterprise Portal &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
