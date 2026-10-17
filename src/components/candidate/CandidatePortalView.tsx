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
  Home,
  CheckCheck,
  Trophy,
  Users,
  ChevronDown,
} from 'lucide-react';
import { CandidateProfile, AIPromptLog } from '../../types';
import { SandboxAIAssistant } from '../sandbox/SandboxAIAssistant';
import { ChallengePromptModal } from '../sandbox/ChallengePromptModal';
import { useToast } from '../common/Toast';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-400 text-xs font-mono space-y-2">
      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Initializing Monaco Developer Environment...</span>
    </div>
  ),
});

export interface CompetitionChallenge {
  id: string;
  key: 'reconcile' | 'rate_limiter' | 'janitor';
  title: string;
  sponsor: string;
  roleTitle: string;
  bounty: number;
  testCount: number;
  targetFilename: string;
  targetEndpoint: string;
  starterCode: string;
  starterNotes: string;
  description: string;
}

export const COMPETITION_CHALLENGES: CompetitionChallenge[] = [
  {
    id: 'chal-1',
    key: 'reconcile',
    title: 'Payment Reconciliation API Latency Optimization',
    sponsor: 'Razorpay Labs',
    roleTitle: 'Backend Engineering Intern (Python)',
    bounty: 3000,
    testCount: 18,
    targetFilename: 'solution.py',
    targetEndpoint: 'POST /reconcile',
    starterCode: `def reconcile_invoices(invoices, payments):
    """
    Reconciles unverified payment transactions against invoice IDs.
    
    Refactored from baseline AI output:
    1. Guards against zero-value or negative payments (paid <= 0)
    2. Prevents duplicate payment matches for the same invoice ID
    3. Optimized to O(N) hashmap lookup
    """
    matched_ids = []
    seen = set()
    
    # Filter valid positive payments
    valid_payments = {p['id']: p['paid'] for p in payments if p.get('paid', 0) > 0}
    
    for inv in invoices:
        inv_id = inv.get('id')
        if inv_id not in seen and valid_payments.get(inv_id) == inv.get('amt'):
            matched_ids.append(inv_id)
            seen.add(inv_id)
            
    return matched_ids
`,
    starterNotes: `# Candidate Architectural Decisions & AI Audit Notes
**Candidate Task:** Payment Reconciliation API Latency Optimization

### AI Code Modifications & Refactoring Rationale
1. **Zero-Value Payment Exploit:** The initial AI assistant output accepted zero and negative payment amounts (amt == paid == 0). Added explicit guards (pay['paid'] > 0) to prevent unauthorized invoice closure.
2. **Duplicate Injection Vulnerability:** The baseline nested loop re-matched duplicate payments against the same invoice ID. Refactored the lookup to an O(n) hash set with deduplication.
3. **Time Complexity:** Replaced O(N*M) nested iteration with an indexed dictionary lookup, reducing P99 latency from 18ms to 1.1ms for 10k transactions.
`,
    description: 'Optimize high-throughput batch invoice-to-payment reconciliation from O(n^2) nested scan to O(n) hash mapping while surviving concurrent webhook bursts.',
  },
  {
    id: 'chal-2',
    key: 'rate_limiter',
    title: 'Distributed Sliding Window Rate Limiter Engine',
    sponsor: 'Swiggy Core Infrastructure',
    roleTitle: 'Junior Distributed Systems Engineer (Go)',
    bounty: 4000,
    testCount: 24,
    targetFilename: 'rate_limiter.py',
    targetEndpoint: 'GET /rate-limit/check',
    starterCode: `import time

class SlidingWindowRateLimiter:
    """
    Distributed sliding window rate limiter.
    Capacity: max_requests per window_seconds per client_id.
    """
    def __init__(self, capacity=3, window_seconds=10):
        self.capacity = capacity
        self.window_seconds = window_seconds
        self.requests = {}

    def is_allowed(self, client_id, current_timestamp=None):
        now = current_timestamp if current_timestamp is not None else time.time()
        cutoff = now - self.window_seconds
        
        if client_id not in self.requests:
            self.requests[client_id] = []
            
        # Clean timestamps older than the sliding window cutoff
        self.requests[client_id] = [t for t in self.requests[client_id] if t > cutoff]
        
        if len(self.requests[client_id]) < self.capacity:
            self.requests[client_id].append(now)
            return True, self.capacity - len(self.requests[client_id])
            
        return False, 0
`,
    starterNotes: `# Candidate Architectural Decisions & AI Audit Notes
**Candidate Task:** Distributed Sliding Window Rate Limiter Engine

### Architectural Rationale & Concurrency Strategy
1. **Window Granularity:** Utilizes sliding window log rather than fixed window to prevent 2x burst exploit at minute boundaries.
2. **Memory Retention:** Automatically purges timestamp entries older than window_seconds to bound memory consumption under DDoS.
3. **Complexity:** Amortized O(1) checks per client key with O(K) eviction where K <= capacity.
`,
    description: 'Implement an atomic sliding window rate limiter capable of sustaining 15,000 req/sec without race conditions or memory allocation spikes.',
  },
  {
    id: 'chal-3',
    key: 'janitor',
    title: 'Ephemeral PR Staging Clusters with TTL Janitor',
    sponsor: 'Zerodha Engineering',
    roleTitle: 'Cloud Infrastructure & SRE Intern',
    bounty: 3500,
    testCount: 14,
    targetFilename: 'janitor.py',
    targetEndpoint: 'POST /janitor/sweep',
    starterCode: `import time

def cleanup_expired_namespaces(namespaces, max_ttl_seconds=14400):
    """
    Scans ephemeral preview namespaces and prunes those exceeding TTL.
    Prevents orphaned cloud resource waste.
    """
    now = 1700000000  # deterministic epoch reference
    reclaimed = []
    
    for ns in namespaces:
        created_at = ns.get("created_at", now)
        is_protected = ns.get("protected", False)
        
        # Prune only unprotected namespaces exceeding max_ttl
        if not is_protected and (now - created_at) >= max_ttl_seconds:
            reclaimed.append(ns.get("name"))
            
    return reclaimed
`,
    starterNotes: `# Candidate Architectural Decisions & AI Audit Notes
**Candidate Task:** Ephemeral PR Staging Clusters with TTL Janitor

### Infrastructure Strategy
1. **Protected Namespace Guard:** Whitelists production-mirror and long-lived system namespaces against automated janitor reaping.
2. **Deterministic Epoch Comparison:** Calculates expiration offset strictly based on namespace creation timestamps.
3. **Safe Pruning:** Generates audit list of candidate namespaces before triggering cascading API deletions.
`,
    description: 'Configure automated pull-request staging namespaces with strictly bounded resource quotas and automatic 4-hour TTL janitor cleanup.',
  },
];

const LEADERBOARD_ENTRIES = [
  { rank: 1, name: 'Priya Nair', handle: '@priya-cloud', score: 98, tests: '100% (14/14)', time: '24m', bounty: '₹4,000 Disbursed', status: 'Offer Extended' },
  { rank: 2, name: 'Kabir Mehra (You)', handle: '@kabir-dev', score: 96, tests: '100% (18/18)', time: '42m', bounty: '₹3,000 Disbursed', status: 'Fast-Track PPO' },
  { rank: 3, name: 'Ananya Iyer', handle: '@ananya-apm', score: 94, tests: '100% (20/20)', time: '48m', bounty: '₹2,500 Disbursed', status: 'Verified' },
  { rank: 4, name: 'Aarav Sharma', handle: '@aarav-sys', score: 92, tests: 'Pending', time: '51m', bounty: '₹3,000 Escrow Locked', status: 'In Evaluation' },
];

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
  onReturnHome?: () => void;
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
  onReturnHome,
}) => {
  const { showToast } = useToast();
  const [trialStarted, setTrialStarted] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<CompetitionChallenge>(COMPETITION_CHALLENGES[0]);
  const [activeFile, setActiveFile] = useState<string>('solution.py');
  const [rightPanel, setRightPanel] = useState<'terminal' | 'assistant'>('assistant');
  const [copied, setCopied] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs'>('vs-dark');

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

  // Active real-time countdown timer starting from 84 minutes 12 seconds
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(84 * 60 + 12);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Countdown timer effect
  useEffect(() => {
    if (!trialStarted || hasSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [trialStarted, hasSubmitted]);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length, isRunningTest]);

  const handleSelectChallenge = (chal: CompetitionChallenge) => {
    setSelectedChallenge(chal);
    setActiveFile(chal.targetFilename);
    onCodeChange(chal.starterCode);
    onNotesChange(chal.starterNotes);
    showToast('Challenge Loaded', `Switched to ${chal.title} (₹${chal.bounty.toLocaleString('en-IN')} Escrow Stipend).`, 'info');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile === selectedChallenge.targetFilename ? code : notesContent);
    setCopied(true);
    showToast('Code Copied', `${activeFile} copied to clipboard.`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTestsWithTerminalSwitch = () => {
    setRightPanel('terminal');
    onRunTest();
  };

  const handleFinalSubmit = () => {
    setShowSubmitModal(false);
    setHasSubmitted(true);
    setRightPanel('terminal');
    onRunTest();
    showToast('Deliverable Submitted', `All ${selectedChallenge.testCount} test gates passed. ₹${selectedChallenge.bounty.toLocaleString('en-IN')} stipend disbursed!`, 'success');
  };

  // 1. PRE-FLIGHT BRIEFING SCREEN
  if (!trialStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6 animate-in fade-in duration-300">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>BuildCheck Verified Internship Work Trial</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Invite Verified
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                {selectedChallenge.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Sponsor: <strong className="text-slate-200">{selectedChallenge.sponsor}</strong> &bull; Role: <strong className="text-slate-200">{selectedChallenge.roleTitle}</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase block font-mono">Guaranteed Compensation</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">₹{selectedChallenge.bounty.toLocaleString('en-IN')}.00 INR</span>
              <span className="text-[10px] text-slate-500 block">RazorpayX Bank Escrow</span>
            </div>
          </div>

          {/* Role Switcher in Preflight */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>Select Target Internship Role:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {COMPETITION_CHALLENGES.map((chal) => (
                <button
                  key={chal.id}
                  onClick={() => handleSelectChallenge(chal)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedChallenge.id === chal.id
                      ? 'bg-slate-800 border-emerald-500/50 text-slate-100 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-200 truncate">{chal.sponsor}</span>
                    <span className="font-mono text-emerald-400 font-bold">₹{chal.bounty.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {chal.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>90-Minute Sprint Window</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Focused sprint respecting your time. Deliverable is auto-saved continuously in isolated sandbox.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>₹{selectedChallenge.bounty.toLocaleString('en-IN')} Trial Stipend</span>
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

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLeaderboardModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800 transition-colors cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>View Peer Cohort Benchmarks</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onReturnHome && (
                <button
                  onClick={onReturnHome}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition-colors cursor-pointer"
                >
                  &larr; Return to Home
                </button>
              )}

              <button
                onClick={() => setTrialStarted(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg"
              >
                <span>Launch 90-Min Work Trial Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. FOCUSED 3-PANEL SANDBOX WORKSPACE
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Workspace Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-xs">
            {candidate.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-200 font-mono">
                {selectedChallenge.targetEndpoint}
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-xs text-slate-300 font-medium">
                {selectedChallenge.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>Candidate: <strong className="text-slate-200">{candidate.name}</strong> ({candidate.handle})</span>
              <span>&bull;</span>
              <span>{selectedChallenge.sponsor}</span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-mono">₹{selectedChallenge.bounty.toLocaleString('en-IN')} INR Escrow</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Competition Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Active Countdown Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
            <Clock className={`w-3.5 h-3.5 ${timeLeftSeconds < 300 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <span>{formattedTime} remaining</span>
          </div>

          {/* Live Leaderboard Button */}
          <button
            onClick={() => setShowLeaderboardModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
            title="Live Sprint Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Leaderboard</span>
          </button>

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
            onClick={handleRunTestsWithTerminalSwitch}
            disabled={isRunningTest}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              isRunningTest
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-wait'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            {isRunningTest ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Running PyTest...</span>
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
            disabled={isRunningTest}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Submit Sprint (₹{selectedChallenge.bounty.toLocaleString('en-IN')})</span>
          </button>

          {onReturnHome && (
            <button
              onClick={onReturnHome}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer text-xs"
              title="Exit to Home"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
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
                onClick={() => setActiveFile(selectedChallenge.targetFilename)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                  activeFile === selectedChallenge.targetFilename
                    ? 'bg-slate-900 text-emerald-400 border border-slate-800 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedChallenge.targetFilename}</span>
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
              language={activeFile === 'NOTES.md' ? 'markdown' : 'python'}
              defaultLanguage={activeFile === 'NOTES.md' ? 'markdown' : 'python'}
              value={activeFile === selectedChallenge.targetFilename ? code : notesContent}
              onChange={(val) => {
                if (activeFile === selectedChallenge.targetFilename) {
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
            <span>Target: {selectedChallenge.targetEndpoint}</span>
            <span className="text-emerald-400 font-medium">{selectedChallenge.testCount} Unit Test Assertions Bound</span>
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
                candidateHandle={candidate.handle}
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
                        Executing PyTest assertions against {selectedChallenge.targetFilename}...
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

      {/* 3. Post-Submission Settlement Receipt */}
      {hasSubmitted && (
        <div className="w-full p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-slate-100 font-bold text-sm tracking-tight">
                  Sprint Submitted &amp; Verified • ₹{selectedChallenge.bounty.toLocaleString('en-IN')} Escrow Stipend Disbursed
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  DISBURSED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                Your deliverable passed all {selectedChallenge.testCount} assertions with edge-case guards and deduplication. The ₹{selectedChallenge.bounty.toLocaleString('en-IN')}.00 trial stipend has been sent to your RazorpayX registered payout account.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onReturnHome && (
              <button
                onClick={onReturnHome}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors cursor-pointer"
              >
                &larr; Exit to Home
              </button>
            )}

            <button
              onClick={onSwitchToEnterprise}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              Recruiter Evaluation Dossier &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Challenge Rules Modal */}
      <ChallengePromptModal
        isOpen={showPromptModal}
        onClose={() => setShowPromptModal(false)}
      />

      {/* Live Peer Cohort Benchmarks Modal */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Peer Cohort Evaluation Benchmarks &bull; {selectedChallenge.sponsor}
                </h3>
              </div>
              <button
                onClick={() => setShowLeaderboardModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Live standings for <strong className="text-slate-200">{selectedChallenge.title}</strong> evaluated by the Deterministic EVS engine:
            </p>

            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2.5">Rank</th>
                    <th className="px-4 py-2.5">Candidate</th>
                    <th className="px-4 py-2.5">EVS Score</th>
                    <th className="px-4 py-2.5">Unit Tests</th>
                    <th className="px-4 py-2.5">Sprint Time</th>
                    <th className="px-4 py-2.5 text-right">Trial Stipend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {LEADERBOARD_ENTRIES.map((entry) => {
                    const isYou = entry.rank === 2;
                    return (
                      <tr
                        key={entry.rank}
                        className={isYou ? 'bg-emerald-500/10 font-medium' : 'hover:bg-slate-850/50'}
                      >
                        <td className="px-4 py-2.5 font-bold font-mono text-emerald-400">
                          #{entry.rank}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-bold text-slate-100">{entry.name}</span>
                          <span className="text-[10px] text-slate-500 block">{entry.handle}</span>
                        </td>
                        <td className="px-4 py-2.5 font-mono font-bold text-emerald-400">
                          {entry.score}/100
                        </td>
                        <td className="px-4 py-2.5 text-slate-300 font-mono text-[11px]">
                          {entry.tests}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px]">
                          {entry.time}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-400">
                          {entry.bounty}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setShowLeaderboardModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 cursor-pointer"
              >
                Close Benchmarks
              </button>
            </div>
          </div>
        </div>
      )}

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
                Please verify that your submission for <strong className="text-slate-200">{selectedChallenge.title}</strong> adheres to core engineering best practices:
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">
                    <strong>Algorithmic Bounds:</strong> Optimized complexity and zero resource leaks under simulated bursts.
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">
                    <strong>Defensive Guards:</strong> Handled pathological edge cases, zero-value conditions, and duplicate injections.
                  </span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">
                    <strong>NOTES.md Documentation:</strong> Architectural rationale documented for engineering review.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">RazorpayX Escrow Disbursement Guarantee:</span>
                <p>
                  Upon clicking submit, your deliverable will be timestamped and evaluated. Your guaranteed ₹{selectedChallenge.bounty.toLocaleString('en-IN')} trial stipend will be disbursed to your registered Indian bank/UPI account immediately.
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
                <span>Confirm &amp; Disburse ₹{selectedChallenge.bounty.toLocaleString('en-IN')} Stipend</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
