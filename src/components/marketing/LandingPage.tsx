'use client';

import React, { useState } from 'react';
import {
  Code2,
  Building2,
  User,
  ShieldCheck,
  Zap,
  Bot,
  ArrowRight,
  CheckCircle2,
  Lock,
  Terminal,
  FileCheck2,
  Layers,
  Sparkles,
  GitCompare,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  Play,
  ChevronRight,
  ExternalLink,
  Sun,
  Moon,
  GraduationCap,
} from 'lucide-react';

interface LandingPageProps {
  onOpenGateway: (targetRole?: 'recruiter' | 'candidate' | 'tpo_admin') => void;
  onDirectEnter: (role: 'recruiter' | 'candidate' | 'tpo_admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenGateway,
  onDirectEnter,
}) => {
  // Lens toggle: 'recruiter' (Engineering Leaders) | 'candidate' (Engineers)
  const [activeLens, setActiveLens] = useState<'recruiter' | 'candidate'>('recruiter');
  const [isDark, setIsDark] = useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextDark = document.documentElement.classList.toggle('dark');
    setIsDark(nextDark);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Global Marketing Top Header */}
      <header className="w-full bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-100">
                BuildCheck
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Enterprise
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#how-it-works" className="hover:text-slate-200 transition-colors">
              How It Works
            </a>
            <a href="#comparison" className="hover:text-slate-200 transition-colors">
              The Protocol
            </a>
            <a href="#security" className="hover:text-slate-200 transition-colors">
              Security &amp; Escrow
            </a>
            <a href="#preview" className="hover:text-slate-200 transition-colors">
              Interactive Preview
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenGateway('tpo_admin')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 hover:text-purple-100 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              <span>Institute TPO</span>
            </button>

            <button
              onClick={() => onOpenGateway('candidate')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Candidate Access</span>
            </button>

            <button
              onClick={() => onOpenGateway('recruiter')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Recruiter Portal</span>
            </button>

            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Interactive Dual-Lens Selector */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Dual-Lens Pill Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-full shadow-lg">
            <button
              onClick={() => setActiveLens('recruiter')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeLens === 'recruiter'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>For Engineering Leaders</span>
            </button>

            <button
              onClick={() => setActiveLens('candidate')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeLens === 'candidate'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>For Software Engineers</span>
            </button>
          </div>

          {/* Morphing Headline & Copy based on Active Lens */}
          {activeLens === 'recruiter' ? (
            /* Recruiter / Hiring Manager Lens */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Practical Engineering Work Trials &bull; RazorpayX Escrow Backed</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 max-w-3xl leading-[1.15]">
                Replace Resume Guesswork with Audited 90-Minute Work Trials
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Convert unassigned backlog debt into sandboxed engineering challenges. Automatically evaluate candidates across functional test suites, AI prompt precision, human refactoring index, and defensive security.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => onDirectEnter('recruiter')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Launch Recruiter Workspace (Demo)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenGateway('recruiter')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-800 transition-colors cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>Sign In with SSO</span>
                </button>
              </div>
            </div>
          ) : (
            /* Candidate / Engineer Lens */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>₹3,000 INR Guaranteed Escrow Stipend &bull; Paid Upon Submission</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 max-w-3xl leading-[1.15]">
                Get Paid ₹3,000 to Build Real Systems, Not Memorize LeetCode Puzzles
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                No artificial whiteboard puzzles. No unpaid 10-hour take-homes. Solve real-world production engineering tasks inside a sandboxed Monaco IDE with built-in AI assistance. Get evaluated on how you audit and harden code.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => onDirectEnter('candidate')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Enter 90-Min Trial as Kabir M. (₹3,000)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenGateway('candidate')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-800 transition-colors cursor-pointer"
                >
                  <span>Claim Invite Token</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Interactive Hero Visual Preview (Morphs based on lens) */}
        <div id="preview" className="mt-12 sm:mt-16 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          {/* Window Chrome Header */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></span>
              <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></span>
              <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></span>
              <span className="text-xs font-mono text-slate-400 ml-2">
                {activeLens === 'recruiter'
                  ? 'buildcheck.internal/evaluator/dossier/cand-891'
                  : 'buildcheck.internal/eval/inv_8x92fa1/workspace'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {activeLens === 'recruiter' ? 'Deterministic EVS: 96/100' : 'Escrow Locked: ₹3,000.00 INR'}
              </span>
            </div>
          </div>

          {/* Morphing Window Content */}
          <div className="p-4 sm:p-6 bg-slate-950/80">
            {activeLens === 'recruiter' ? (
              /* Recruiter Lens Preview: Senior Staff AI Evaluation Dossier */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-xs">
                      KM
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-xs sm:text-sm">
                          Kabir M. &bull; Staff AI Engineering Evaluation Dossier
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          FAST_TRACK_OFFER
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Task: Payment Reconciliation API &bull; 18/18 Unit Tests Passed &bull; Top 4% Vector Affinity
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 block uppercase">Composite EVS</span>
                    <span className="text-lg font-bold text-emerald-400">96 / 100</span>
                  </div>
                </div>

                {/* 4 Rubric Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px] block">1. Correctness</span>
                    <span className="font-bold text-emerald-400 font-mono">100/100</span>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-full"></div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px] block">2. AI Efficiency</span>
                    <span className="font-bold text-emerald-400 font-mono">95/100</span>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[95%]"></div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px] block">3. Refactoring</span>
                    <span className="font-bold text-emerald-400 font-mono">92/100</span>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[92%]"></div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px] block">4. Security Guard</span>
                    <span className="font-bold text-emerald-400 font-mono">96/100</span>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[96%]"></div>
                    </div>
                  </div>
                </div>

                {/* Diff Preview */}
                <div className="bg-black border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-slate-300 overflow-x-auto space-y-0.5">
                  <div className="text-slate-500">@@ Code Refactoring Diff: Baseline AI &rarr; Kabir M. Solution @@</div>
                  <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded">+ valid_payments = &#123;p['id']: p['paid'] for p in payments if p.get('paid', 0) &gt; 0&#125;</div>
                  <div className="text-red-400 bg-red-950/40 px-1 rounded">- for pay in payments: if inv['id'] == pay['id'] and inv['amt'] == pay['paid']:</div>
                  <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded">+ if inv_id not in seen and valid_payments.get(inv_id) == inv.get('amt'): seen.add(inv_id)</div>
                </div>
              </div>
            ) : (
              /* Candidate Lens Preview: Monaco IDE with In-Sandbox AI Assistant */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                  <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" />
                        solution.py (POST /reconcile)
                      </span>
                      <span>84:12 remaining</span>
                    </div>
                    <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`def reconcile_invoices(invoices, payments):
    matched_ids = []
    seen = set()
    # Guard against zero-value payment exploit
    valid_payments = {p['id']: p['paid'] for p in payments if p.get('paid', 0) > 0}
    for inv in invoices:
        inv_id = inv.get('id')
        if inv_id not in seen and valid_payments.get(inv_id) == inv.get('amt'):
            matched_ids.append(inv_id)
            seen.add(inv_id)
    return matched_ids`}
                    </pre>
                  </div>

                  <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between text-xs">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-200 font-bold border-b border-slate-800 pb-2">
                        <Bot className="w-4 h-4 text-emerald-400" />
                        <span>Sandbox AI Assistant (Audited)</span>
                      </div>
                      <p className="text-[11px] text-amber-300/90 leading-snug">
                        <strong>Notice:</strong> Baseline AI output has intentional edge-case flaws. You are scored on your prompt precision and code refactoring.
                      </p>
                      <div className="p-2.5 rounded bg-black border border-slate-850 font-mono text-[10px] text-slate-400">
                        &gt; Filter out payments where paid &lt;= 0 and deduplicate matches in O(N).
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400">✓ PyTest Passed (3/3)</span>
                      <span className="font-bold text-slate-200">₹3,000 Stipend Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Social Proof & Enterprise Engineering Logos */}
      <section className="border-y border-slate-900 bg-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Engineered for high-velocity engineering organizations
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 font-bold text-sm tracking-wider">
            <span>RAZORPAY LABS</span>
            <span>SWIGGY</span>
            <span>ZERODHA</span>
            <span>CRED</span>
            <span>FLIPKART</span>
          </div>
        </div>
      </section>

      {/* 5. The Comparison: Why Whiteboards Failed vs The Protocol */}
      <section id="comparison" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
            The Paradigm Shift
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 tracking-tight">
            Traditional Algorithmic Puzzles vs. BuildCheck Work Trials
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            How practical, paid work trials outperform synthetic puzzles across every key hiring metric.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Quo Card */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>The Broken Status Quo (Generic Puzzles &amp; Unpaid Homework)</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>42-Day Hiring Latency:</strong> Endless rounds of phone screens and artificial LeetCode whiteboarding.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Synthetic Trivia:</strong> Tests memorized binary tree inversions rather than real production debugging.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Uncompensated Homework:</strong> Demands 10+ hours of unpaid take-home projects that top engineers decline.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Unchecked AI Copy-Pasting:</strong> Candidates secretly paste into ChatGPT with zero auditability or insight.</span>
              </li>
            </ul>
          </div>

          {/* BuildCheck Protocol Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>The BuildCheck Model (Practical 90-Min Work Trials)</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>3.2-Day Verified Turnaround:</strong> Direct match from sandboxed task pass gates to fast-track offer desk.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Production Backlog Tasks:</strong> Tests real-world API reconciliation, rate limiting, and concurrency.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Guaranteed ₹3,000 Escrow Stipend:</strong> Compensates candidates upfront for passing test gates via RazorpayX.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Audited Engineering Evaluation:</strong> Full prompt transcript, human refactor ratio, and defensive security audits.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. The 3-Step Work-Trial Engine */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 bg-slate-900/30 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Engineering Work Trials
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 tracking-tight">
              The 3-Step Work-Trial Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Deterministic, end-to-end evaluation with zero recruiter overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-xs">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-100">
                AI Task Scoper Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingest unresolved Linear/Jira issues and transform them into sandboxed, calibrated 90-minute challenges with automated PyTest test assertions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-xs">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-100">
                Audited Work Trial Sandbox (₹3,000)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Candidates work inside an isolated Monaco IDE with built-in AI assistance. Every prompt, keystroke edit, and test execution is logged for evaluation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-xs">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-100">
                Automated Engineering Evaluation Dossier
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive an objective hiring dossier with 4-dimension EVS scores, side-by-side Git diffs, and prompt interrogation logs. Disburse ₹3,000 and extend offers with 1 click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Enterprise Security & Escrow Guarantee */}
      <section id="security" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Enterprise Financial &amp; Container Security</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              RazorpayX Escrow &amp; Isolated Docker Sandboxes
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every work trial stipend (₹3,000) is pre-funded into a secure RazorpayX corporate escrow vault. Deliverables execute in ephemeral, network-isolated Linux containers with instant UPI payouts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onDirectEnter('recruiter')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer text-center"
            >
              Access Recruiter Portal
            </button>
            <button
              onClick={() => onDirectEnter('candidate')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-200 font-medium text-xs border border-slate-800 transition-colors cursor-pointer text-center"
            >
              Access Candidate Trial
            </button>
          </div>
        </div>
      </section>

      {/* 8. Global Marketing Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 px-4 sm:px-6 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">BuildCheck</span>
            <span>&bull;</span>
            <span>Intern &amp; Junior Engineering Placements</span>
            <span>&bull;</span>
            <span>RazorpayX Escrow Backed</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>pgvector 0.7.0</span>
            <span>RazorpayX Escrow</span>
            <span>Python 3.10 Sandbox</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
