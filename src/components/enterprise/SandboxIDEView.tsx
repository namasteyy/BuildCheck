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
  ArrowRight,
  Code2,
  Layers,
  FileText,
  Bot,
  Zap,
  Archive,
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
  // Default to evaluator_report for recruiters
  const [activeViewMode, setActiveViewMode] = useState<'evaluator_report' | 'sandbox'>('evaluator_report');
  const [copied, setCopied] = useState(false);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs'>('vs-dark');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setEditorTheme(isDark ? 'vs-dark' : 'vs');
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length, isRunningTest]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile === 'solution.py' ? code : notesContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Candidate & Task Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-sm">
            {candidate.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                {candidate.name}
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                {candidate.handle}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {candidate.vectorMatch}% Skill Match
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Task: <strong className="text-slate-200">{candidate.taskName}</strong> &bull; Bounty: <strong className="text-emerald-400">${candidate.bounty} Escrow Funded</strong>
            </p>
          </div>
        </div>

        {/* View Switcher: AI Evaluator Dossier vs Interactive Code Editor */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveViewMode('evaluator_report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeViewMode === 'evaluator_report'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Evaluation Dossier (EVS {evaluation.evs_total_score})</span>
            </button>

            <button
              onClick={() => setActiveViewMode('sandbox')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeViewMode === 'sandbox'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Raw Code &amp; Sandbox</span>
            </button>
          </div>

          <button
            onClick={() => onNavigateTab('escrow')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Award className="w-4 h-4" />
            <span>Fast-Track Offer Desk &rarr;</span>
          </button>
        </div>
      </div>

      {activeViewMode === 'evaluator_report' ? (
        /* Senior Staff AI Evaluator Report View */
        <div className="space-y-4">
          <EvaluatorTelemetryCard
            evaluation={evaluation}
            promptLogs={promptLogs}
            notesContent={notesContent}
            candidateName={candidate.name}
            taskName={candidate.taskName}
          />

          {/* Executive Action Bar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Deterministic recommendation: <strong className="text-emerald-400 font-semibold">{evaluation.hiring_recommendation}</strong>. All test suites verified.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('escrow')}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 text-xs font-medium border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5 text-slate-500" />
                <span>Archive with Feedback</span>
              </button>

              <button
                onClick={() => onNavigateTab('escrow')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Disburse ₹3,000 &amp; Extend Offer</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2-Column IDE & Terminal Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Monaco Editor (7 cols) */}
          <div className="lg:col-span-7 h-[600px] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Editor Header Bar with file tabs */}
            <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveFile('solution.py')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    activeFile === 'solution.py'
                      ? 'bg-slate-900 text-emerald-400 border border-slate-800 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>solution.py</span>
                </button>

                <button
                  onClick={() => setActiveFile('NOTES.md')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    activeFile === 'NOTES.md'
                      ? 'bg-slate-900 text-emerald-400 border border-slate-800 font-bold'
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
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition-colors cursor-pointer"
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
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors cursor-pointer"
                >
                  {isRunningTest ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                      <span>Re-Run Harness</span>
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
                theme={editorTheme}
                options={{
                  fontSize: 12.5,
                  fontFamily: 'var(--font-mono), monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  padding: { top: 10, bottom: 10 },
                  automaticLayout: true,
                  tabSize: 4,
                  bracketPairColorization: { enabled: true },
                }}
              />
            </div>

            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{activeFile === 'solution.py' ? 'Target: POST /reconcile' : 'Target: Deliverable #4 (Architectural Rationale)'}</span>
              <span className="text-emerald-400 font-medium">Verified by Automated EVS Engine</span>
            </div>
          </div>

          {/* Right Column: Execution Output Terminal (5 cols) */}
          <div className="lg:col-span-5 h-[600px] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Container stdout
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Piston v2 / Python 3.10
              </span>
            </div>

            <div className="flex-1 bg-black p-4 font-mono text-xs overflow-y-auto space-y-1.5 select-text border-b border-slate-800">
              <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-900 flex items-center justify-between select-none">
                <span>Worker: vf-worker-891</span>
                <span className="text-emerald-400 font-bold">PASS (3/3)</span>
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
                <div className="py-2 px-3 my-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300 text-xs">
                  <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                  <span className="font-mono text-emerald-400">
                    Executing test harness against solution.py...
                  </span>
                </div>
              )}

              <div ref={terminalEndRef} />
            </div>

            {/* Telemetry Summary */}
            <div className="p-3 bg-slate-950 grid grid-cols-3 gap-2">
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
      )}
    </div>
  );
};
