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
  Bot,
  ExternalLink,
  HelpCircle,
  ListChecks,
  Clock,
  Lock,
  ChevronRight,
  ArrowRight,
  Eye,
  Send,
  Building2,
} from 'lucide-react';
import { CandidateProfile, AIPromptLog } from '../../types';
import { SandboxAIAssistant } from '../sandbox/SandboxAIAssistant';
import { ChallengePromptModal } from '../sandbox/ChallengePromptModal';

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
  notesContent: string;
  onNotesChange: (notes: string) => void;
  promptLogs: AIPromptLog[];
  onAddPromptLog: (sender: 'candidate' | 'assistant', message: string, containedCode?: boolean) => void;
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
  notesContent,
  onNotesChange,
  promptLogs,
  onAddPromptLog,
  isRunningTest,
  onRunTest,
  logs,
  testPassed,
  evsScore,
  escrowDisbursed,
  onSwitchToEnterprise,
}) => {
  // Step in candidate journey: 'preflight' (onboarding) | 'workspace' (IDE) | 'submitted'
  const [trialStarted, setTrialStarted] = useState(true);
  const [activeFile, setActiveFile] = useState<'solution.py' | 'NOTES.md'>('solution.py');
  const [rightPanel, setRightPanel] = useState<'terminal' | 'assistant'>('assistant');
  const [copied, setCopied] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeftMinutes, setTimeLeftMinutes] = useState(84);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length, isRunningTest]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile === 'solution.py' ? code : notesContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalSubmit = () => {
    setShowSubmitModal(false);
    setHasSubmitted(true);
    onRunTest();
  };

  // 1. PRE-FLIGHT BRIEFING SCREEN (When trial has not been launched)
  if (!trialStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-300">
        {/* Onboarding Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Paid Engineering Work Trial
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  inv_8x92fa1
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                Build an AI-Assisted Payment Reconciliation Endpoint
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Sponsor: <strong className="text-slate-200">Stripe Labs</strong> &bull; Role: <strong className="text-slate-200">Senior Backend Engineer (Python)</strong>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase block">Escrow Compensation</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">$150.00 USD</span>
              <span className="text-[10px] text-slate-500 block">Stripe Connect Vault</span>
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>90-Minute Time Box</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Focused sprint respecting your time. Deliverable is auto-saved continuously in isolated sandbox.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>$150 Guaranteed Payout</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Deposited in escrow upfront. Disbursed immediately upon verified submission regardless of hiring outcome.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>AI Tools Permitted</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                In-sandbox AI assistant provided. We evaluate how you audit, refactor, and harden the AI output.
              </p>
            </div>
          </div>

          {/* AI Policy & Rules Contract */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Assistance Rules &amp; Senior Staff Evaluation Rubric</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are encouraged to use the built-in Sandbox AI Assistant to generate starter code or debug errors. However, <strong className="text-amber-300 font-medium">the baseline AI model output contains intentional logical edge cases, security vulnerabilities, and inefficient database queries.</strong>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Functional Correctness:</strong> Passing all automated PyTest unit tests.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>AI Prompt Efficiency:</strong> Precision, token economy, and specific technical constraints.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Human Refactoring Index:</strong> Ratio of your edits vs. raw AI copy-pasted code.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Architectural Notes:</strong> Justifying design decisions in <code className="text-slate-300">NOTES.md</code>.</span>
              </div>
            </div>
          </div>

          {/* System Check Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Monaco IDE Ready</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Docker Sandbox Online</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>$150 Escrow Funded</span>
              </span>
            </div>

            <button
              onClick={() => setTrialStarted(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Begin 90-Minute Work Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. FOCUSED 3-PANEL SANDBOX WORKSPACE
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Workspace Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-xs">
            {candidate.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">
                POST /reconcile
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-xs text-slate-400">
                {candidate.taskName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>Candidate: <strong className="text-slate-200">{candidate.name}</strong> ({candidate.handle})</span>
              <span>&bull;</span>
              <span>Stripe Labs Work Trial</span>
            </div>
          </div>
        </div>

        {/* Status, Countdown Timer & Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Countdown Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{timeLeftMinutes}:12 remaining</span>
          </div>

          {/* View Instructions Button */}
          <button
            onClick={() => setShowPromptModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Rules &amp; Specs</span>
          </button>

          {/* Run PyTest Button */}
          <button
            onClick={onRunTest}
            disabled={isRunningTest}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              isRunningTest
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-wait'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            {isRunningTest ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                <span>Run Tests</span>
              </>
            )}
          </button>

          {/* Submit Deliverable Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Submit Trial ($150)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout (Editor + Assistant/Terminal) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Editor (7 cols) */}
        <div className="lg:col-span-7 h-[620px] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {/* File Tabs & Actions */}
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
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
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
                <span className="text-[10px] text-slate-500 font-normal">(Required)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Monaco Editor Canvas */}
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
                padding: { top: 10, bottom: 10 },
                automaticLayout: true,
                tabSize: 4,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{activeFile === 'solution.py' ? 'Target: POST /reconcile' : 'Target: Deliverable #4 (Architectural Rationale)'}</span>
            <span className="text-emerald-400 font-medium">3 Unit Test Assertions Bound</span>
          </div>
        </div>

        {/* Right Side: Tabbed Switcher between Assistant & Terminal (5 cols) */}
        <div className="lg:col-span-5 h-[620px] flex flex-col">
          {/* Top Panel Tab Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-2">
            <button
              onClick={() => setRightPanel('assistant')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                rightPanel === 'assistant'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sandbox AI Assistant</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-400 font-mono">
                Audited
              </span>
            </button>

            <button
              onClick={() => setRightPanel('terminal')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                rightPanel === 'terminal'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Execution Terminal</span>
            </button>
          </div>

          {/* Panel Display */}
          <div className="flex-1 min-h-0">
            {rightPanel === 'assistant' ? (
              <SandboxAIAssistant
                logs={promptLogs}
                onAddLog={onAddPromptLog}
                onApplyCode={(snippet) => onCodeChange(snippet)}
              />
            ) : (
              <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-slate-200">
                      Sandbox stdout
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Python 3.10 / Piston
                  </span>
                </div>

                <div className="flex-1 bg-black p-4 font-mono text-xs overflow-y-auto space-y-1.5 select-text border-b border-slate-800">
                  <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-900 flex items-center justify-between select-none">
                    <span>Isolated Container (Linux x86_64)</span>
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
                    <div className="py-2 px-3 my-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300 text-xs">
                      <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                      <span className="font-mono text-emerald-400">
                        Executing test harness against solution.py...
                      </span>
                    </div>
                  )}

                  <div ref={terminalEndRef} />
                </div>

                {/* Scorecard */}
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
            )}
          </div>
        </div>
      </div>

      {/* 3. Post-Submission Settlement Receipt (Matte Enterprise) */}
      {hasSubmitted && (
        <div className="w-full p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-slate-100 font-bold text-sm tracking-tight">
                  Trial Submitted &amp; Verified • $150 Escrow Payout Triggered
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  DISBURSED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                Your deliverable passed test gates with zero-value payment guards and deduplication. The $150 bounty has been sent to your Stripe Connect account.
              </p>
            </div>
          </div>

          <button
            onClick={onSwitchToEnterprise}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            Switch to Recruiter View &rarr;
          </button>
        </div>
      )}

      {/* Challenge Rules Modal */}
      <ChallengePromptModal
        isOpen={showPromptModal}
        onClose={() => setShowPromptModal(false)}
      />

      {/* Pre-Submission Self-Audit & Git Diff Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Pre-Submission Review &amp; Self-Audit Checklist
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Please verify that your submission adheres to the engineering standards evaluated by the Senior Staff AI engine:
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">
                    <strong>Zero-Value Payment Guard:</strong> Rejecting payments where <code className="text-emerald-400 font-mono">paid &lt;= 0</code>.
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">
                    <strong>Duplicate Invoice Guard:</strong> Deduplicating matches to prevent double disbursement.
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">
                    <strong>NOTES.md Documentation:</strong> Architectural rationale documented for Senior Staff review.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">Stripe Escrow Disbursement Guarantee:</span>
                <p>
                  Upon clicking submit, your deliverable will be timestamped and evaluated. Your guaranteed $150 compensation will be disbursed to your registered payout account immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Return to Editor
              </button>

              <button
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Disburse $150 Bounty</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
