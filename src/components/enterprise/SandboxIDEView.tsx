'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Award,
  DollarSign,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  FileText,
  Bot,
  Zap,
} from 'lucide-react';
import { CandidateProfile, EnterpriseTab, AIEvaluationResult, AIPromptLog } from '../../types';
import { EvaluatorTelemetryCard } from './EvaluatorTelemetryCard';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-400 text-xs font-mono space-y-2">
      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Initializing Monaco Enterprise Sandbox...</span>
    </div>
  ),
});

interface SandboxIDEViewProps {
  candidate: CandidateProfile;
  code: string;
  onCodeChange: (code: string) => void;
  notesContent: string;
  onNotesChange: (notes: string) => void;
  promptLogs: AIPromptLog[];
  evaluation: AIEvaluationResult;
  isRunningTest: boolean;
  onRunTest: () => void;
  logs: { timestamp: string; type: string; message: string }[];
  testPassed: boolean;
  evsScore: number;
  onNavigateTab: (tab: EnterpriseTab) => void;
}

export const SandboxIDEView: React.FC<SandboxIDEViewProps> = ({
  candidate,
  code,
  onCodeChange,
  notesContent,
  onNotesChange,
  promptLogs,
  evaluation,
  isRunningTest,
  onRunTest,
  logs,
  testPassed,
  evsScore,
  onNavigateTab,
}) => {
  const [activeFile, setActiveFile] = useState<'solution.py' | 'NOTES.md'>('solution.py');
  const [activeViewMode, setActiveViewMode] = useState<'sandbox' | 'evaluator_report'>('sandbox');
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length, isRunningTest]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile === 'solution.py' ? code : notesContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Candidate & Task Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
            {candidate.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                {candidate.name}
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {candidate.handle}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {candidate.vectorMatch}% Vector Match
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Task: <strong className="text-slate-200">{candidate.taskName}</strong> &bull; Sprint Bounty: <strong className="text-emerald-400">${candidate.bounty} USDC</strong>
            </p>
          </div>
        </div>

        {/* View Switcher: Sandbox vs AI Evaluator Report */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveViewMode('sandbox')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeViewMode === 'sandbox'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>IDE &amp; Sandbox</span>
            </button>
            <button
              onClick={() => setActiveViewMode('evaluator_report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeViewMode === 'evaluator_report'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>AI Evaluator Report (EVS {evaluation.evs_total_score})</span>
            </button>
          </div>

          {testPassed && (
            <button
              onClick={() => onNavigateTab('escrow')}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] cursor-pointer whitespace-nowrap"
            >
              <Award className="w-4 h-4" />
              <span>Extend Offer &rarr;</span>
            </button>
          )}
        </div>
      </div>

      {activeViewMode === 'evaluator_report' ? (
        /* Senior Staff AI Evaluator Report View */
        <EvaluatorTelemetryCard
          evaluation={evaluation}
          promptLogs={promptLogs}
          notesContent={notesContent}
        />
      ) : (
        /* 2-Column IDE & Terminal Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Monaco Editor (7 cols) */}
          <div className="lg:col-span-7 h-[640px] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Editor Header Bar with file tabs */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveFile('solution.py')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    activeFile === 'solution.py'
                      ? 'bg-slate-950 text-emerald-400 border border-slate-700 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>solution.py</span>
                </button>

                <button
                  onClick={() => setActiveFile('NOTES.md')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    activeFile === 'NOTES.md'
                      ? 'bg-slate-950 text-emerald-400 border border-slate-700 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>NOTES.md</span>
                </button>
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
                  disabled={isRunningTest}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isRunningTest
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-wait animate-pulse'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                  }`}
                >
                  {isRunningTest ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Sandbox...</span>
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

            {/* Monaco Editor Container */}
            <div className="flex-1 min-h-0 bg-slate-950 relative">
              <Editor
                height="100%"
                language={activeFile === 'solution.py' ? 'python' : 'markdown'}
                defaultLanguage={activeFile === 'solution.py' ? 'python' : 'markdown'}
                value={activeFile === 'solution.py' ? code : notesContent}
                onChange={(val) => {
                  if (activeFile === 'solution.py') {
                    onCodeChange(val || '');
                  } else {
                    onNotesChange(val || '');
                  }
                }}
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
              <span>Deterministic Runner: Piston v2 / emkc.org</span>
              <span className="text-emerald-400 font-semibold">18 Test Assertions Bound</span>
            </div>
          </div>

          {/* Right Column: Terminal & Telemetry (5 cols) */}
          <div className="lg:col-span-5 h-[640px] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Sandbox Execution Terminal
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                EXIT CODE 0
              </span>
            </div>

            {/* Black Terminal Body */}
            <div className="flex-1 bg-black p-4 font-mono text-xs overflow-y-auto space-y-2 select-text border-b border-slate-800">
              <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-900 flex items-center justify-between select-none">
                <span>Environment: Python 3.10.0 (Linux x86_64)</span>
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
                <div className="py-2.5 px-3 my-2 rounded bg-slate-950 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                  <span className="font-mono">
                    Provisioning isolated Docker container... Running automated test harness...
                  </span>
                </div>
              )}

              <div ref={terminalEndRef} />
            </div>

            {/* Execution Velocity Telemetry Cards */}
            <div className="p-4 bg-slate-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Execution Velocity Scorecard
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {evsScore} / 100 EVS
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Speed</span>
                  <span className="text-sm font-bold text-slate-100 font-mono">98/100</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Coverage</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">100%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Security</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">Passed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
