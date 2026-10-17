'use client';

import React, { useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { RoleConfig } from '../types';

export interface ExecutionResult {
  output: string;
  passed: boolean;
  evsScore: number;
  metrics?: {
    logicCompleteness?: number;
    edgeCases?: number;
    securityScan?: number;
  };
}

interface TerminalOfferPanelProps {
  role: RoleConfig;
  isRunningTest: boolean;
  logs: { timestamp: string; type: string; message: string }[];
  executionResult: ExecutionResult | null;
}

export const TerminalTelemetryPanel: React.FC<TerminalOfferPanelProps> = ({
  role,
  isRunningTest,
  logs,
  executionResult,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length, isRunningTest]);

  const hasExecuted = executionResult !== null;
  const isPassed = executionResult?.passed === true;

  return (
    <div className="h-[620px] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-slate-950/60">
      {/* 1. Terminal Console Header */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="text-slate-500 text-xs select-none">|</span>
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono font-semibold text-slate-200">
              Terminal stdout
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          {isRunningTest ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              CONTAINER ACTIVE
            </span>
          ) : hasExecuted ? (
            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${
              isPassed
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-red-500/10 text-red-300 border-red-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isPassed ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              {isPassed ? 'EXIT 0' : 'EXIT 1'}
            </span>
          ) : (
            <span className="text-slate-500">IDLE</span>
          )}
        </div>
      </div>

      {/* 1. Terminal Console Body (Right Top) */}
      <div className="flex-1 min-h-[220px] bg-black p-4 font-mono text-xs overflow-y-auto space-y-1.5 select-text border-b border-slate-800">
        {/* Default initial message */}
        <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-900 flex items-center justify-between select-none">
          <span>BuildCheck Sandbox Worker • session: worker-pod-891</span>
          <span className="text-slate-600">x86_64 Linux 6.1</span>
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

        {/* Loading state: Provisioning isolated Docker container... */}
        {isRunningTest && (
          <div className="py-2.5 px-3 my-2 rounded bg-slate-950 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs animate-pulse">
            <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
            <span className="font-mono font-medium">
              Provisioning isolated Docker container... Running automated test harness...
            </span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* 2. Execution Velocity Scorecard (Right Middle) */}
      <div className="p-3.5 bg-slate-900 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Execution Velocity Scorecard (EVS)
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {executionResult ? `${executionResult.evsScore}/100` : '96/100'} EVS
          </span>
        </div>

        {/* 3 Telemetry Metrics: Speed, Test Coverage, Code Security */}
        <div className="grid grid-cols-3 gap-2">
          {/* Speed (98/100) */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              Speed
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-bold text-slate-100 font-mono">
                98<span className="text-[10px] text-slate-500 font-normal">/100</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">P99 &lt;1.8ms</span>
            </div>
          </div>

          {/* Test Coverage (100%) */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              Test Coverage
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-bold text-slate-100 font-mono">
                100%
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">All Passed</span>
            </div>
          </div>

          {/* Code Security (Passed) */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Code Security
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-bold text-emerald-400 font-mono">
                Passed
              </span>
              <span className="text-[10px] text-slate-400 font-mono">0 CVEs</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Automated Offer Banner (Right Bottom) */}
      <div className="p-3.5 bg-slate-950 flex items-center">
        {isPassed ? (
          /* When passed === true: Animated Green Check Offer Banner */
          <div className="w-full p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/40 border border-emerald-500/50 shadow-[0_0_20px_rgba(52,211,153,0.25)] flex items-center gap-3.5 transition-all duration-500">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 shrink-0 shadow-[0_0_12px_rgba(52,211,153,0.4)]">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-sm sm:text-base tracking-tight truncate">
                  Deliverable Verified & Passed!
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  DISBURSED
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 mt-0.5 leading-snug">
                Fast-Track Offer Extended • ₹3,000 Paid Trial Stipend Disbursed to Candidate
              </p>
            </div>

            <div className="hidden sm:flex items-center justify-center pl-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
          </div>
        ) : hasExecuted && !isPassed ? (
          /* Failed state */
          <div className="w-full p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white">Verification Failed</h4>
              <p className="text-[11px] text-red-300/90">
                Assertion error detected. Review the code in the Left Workspace and run again.
              </p>
            </div>
          </div>
        ) : (
          /* Waiting for execution */
          <div className="w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
              <span className="text-xs text-slate-400">
                Awaiting work submission verification to unlock candidate stipend...
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400/70 border border-slate-800 px-2 py-0.5 rounded bg-slate-950">
              Stipend: ₹3,000
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
