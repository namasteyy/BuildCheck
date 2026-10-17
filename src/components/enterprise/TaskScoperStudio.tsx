'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Clock,
  Layers,
  ArrowRight,
  Code2,
  ListChecks,
  AlertCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { EnterpriseTab, ScopedTask } from '../../types';

interface TaskScoperStudioProps {
  onPublishTask: (task: ScopedTask) => void;
  onNavigateTab: (tab: EnterpriseTab) => void;
}

export const TaskScoperStudio: React.FC<TaskScoperStudioProps> = ({
  onPublishTask,
  onNavigateTab,
}) => {
  const [prompt, setPrompt] = useState(
    'Optimize Payment Reconciliation API latency and handle concurrent webhook bursts.'
  );
  const [bounty, setBounty] = useState(150);
  const [difficulty, setDifficulty] = useState<'Junior' | 'Mid' | 'Senior'>('Senior');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTask, setGeneratedTask] = useState<ScopedTask | null>({
    id: 'task-101',
    title: 'Payment Reconciliation API Latency Optimization',
    difficulty: 'Senior',
    bounty: 150,
    techStack: ['Python 3.10', 'Redis', 'PyTest', 'FastAPI'],
    description:
      'Optimize high-throughput batch invoice-to-payment reconciliation from O(n^2) nested scan to O(n) hash mapping while surviving concurrent webhook bursts.',
    requirements: [
      'Implement reconcile_invoices(invoices, payments) returning matching invoice IDs.',
      'Achieve sub-2ms P99 execution for batches up to 10,000 transactions.',
      'Zero memory leaks under simulated memory pressure test.',
      'Pass all 18 automated idempotency and floating-point edge case tests.',
    ],
    testCount: 18,
    timeLimitHours: 24,
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedTask({
        id: `task-${Math.floor(Math.random() * 900 + 100)}`,
        title: 'Payment Reconciliation API Latency Optimization',
        difficulty,
        bounty,
        techStack: ['Python 3.10', 'Redis', 'PyTest', 'FastAPI'],
        description: prompt,
        requirements: [
          'Implement reconcile_invoices(invoices, payments) returning matching invoice IDs.',
          'Achieve sub-2ms P99 execution for batches up to 10,000 transactions.',
          'Zero memory leaks under simulated memory pressure test.',
          'Pass all 18 automated idempotency and floating-point edge case tests.',
        ],
        testCount: 18,
        timeLimitHours: 24,
      });
      setIsGenerating(false);
    }, 800);
  };

  const handleDeploy = () => {
    if (generatedTask) {
      onPublishTask(generatedTask);
      onNavigateTab('radar');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Bot className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              AI Task Scoper Studio
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Transform unresolved Jira tickets and engineering debt into verified 24-hr trial tasks with automated test harnesses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>Smart Contract Auto-Escrow Enabled</span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Config Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Input Engineering Backlog Issue</span>
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold">
              Problem Description / Ticket Summary:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 leading-relaxed resize-none"
              placeholder="e.g. Optimize Redis sliding window rate limiter..."
            />
          </div>

          {/* Difficulty & Bounty Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">
                Target Seniority:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="Junior">Junior Intern ($100)</option>
                <option value="Mid">Mid-Level ($150)</option>
                <option value="Senior">Senior ($250)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">
                Trial Bounty (USDC):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-500 font-mono">$</span>
                <input
                  type="number"
                  value={bounty}
                  onChange={(e) => setBounty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-6 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>AI Scoper Analyzing Repository Ontology...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Generate Verified Sandbox Task</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Generated Trial Specification</span>
            </h3>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Verified Sandbox Ready
            </span>
          </div>

          {generatedTask ? (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-slate-100">
                  {generatedTask.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {generatedTask.description}
                </p>
              </div>

              {/* Badges bar */}
              <div className="flex flex-wrap items-center gap-2">
                {generatedTask.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300">
                  ${generatedTask.bounty} USDC Escrow
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                  {generatedTask.timeLimitHours}h Sprint Window
                </span>
              </div>

              {/* Acceptance Criteria */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
                  Deterministic Acceptance Matrix
                </span>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  {generatedTask.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-400 font-mono">
                  <span>Escrow Allocation: </span>
                  <strong className="text-emerald-400">${generatedTask.bounty} USDC locked</strong>
                </div>

                <button
                  onClick={handleDeploy}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(52,211,153,0.35)] cursor-pointer"
                >
                  <span>Publish to Vector Talent Radar &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs font-mono">
              Enter backlog issue details on the left to generate task...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
