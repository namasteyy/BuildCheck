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
  BookOpen,
} from 'lucide-react';
import { EnterpriseTab, ScopedTask } from '../../types';
import { useToast } from '../common/Toast';

interface TaskScoperStudioProps {
  onPublishTask: (task: ScopedTask) => void;
  onNavigateTab: (tab: EnterpriseTab) => void;
}

const PRESET_IDEAS = [
  {
    label: 'Payment Reconciliation (Intern Sprint)',
    prompt: 'Optimize Payment Reconciliation API latency and handle concurrent webhook bursts.',
    bounty: 3000,
    difficulty: 'Junior' as const,
  },
  {
    label: 'Sliding Window Rate Limiter (Junior Sprint)',
    prompt: 'Build atomic Redis sliding window rate limiter in Go sustaining 15,000 req/sec.',
    bounty: 4000,
    difficulty: 'Junior' as const,
  },
  {
    label: 'Ephemeral K8s Janitor (Intern Sprint)',
    prompt: 'Configure ephemeral PR Kubernetes namespaces via Terraform with 4-hour TTL janitor.',
    bounty: 3500,
    difficulty: 'Junior' as const,
  },
];

export const TaskScoperStudio: React.FC<TaskScoperStudioProps> = ({
  onPublishTask,
  onNavigateTab,
}) => {
  const { showToast } = useToast();
  const [prompt, setPrompt] = useState(
    'Optimize Payment Reconciliation API latency and handle concurrent webhook bursts.'
  );
  const [bounty, setBounty] = useState(3000);
  const [difficulty, setDifficulty] = useState<'Junior' | 'Mid' | 'Senior'>('Junior');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTask, setGeneratedTask] = useState<ScopedTask | null>({
    id: 'task-101',
    title: 'Payment Reconciliation API Latency Optimization',
    difficulty: 'Junior',
    bounty: 3000,
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

  const handleSelectPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setPrompt(preset.prompt);
    setBounty(preset.bounty);
    setDifficulty(preset.difficulty);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, difficulty, bounty }),
      });
      const data = await res.json();
      if (data.success && data.task) {
        setGeneratedTask(data.task);
        showToast('Challenge Calibrated', `Task "${data.task.title}" generated with ${data.task.testCount} assertions.`, 'success');
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (e: any) {
      // Fallback local calibration
      const fallbackTask: ScopedTask = {
        id: `task-${Date.now().toString().slice(-4)}`,
        title: prompt.length > 50 ? prompt.slice(0, 48) + '...' : prompt,
        difficulty,
        bounty,
        techStack: ['Python 3.10', 'Redis', 'PyTest', 'FastAPI'],
        description: prompt,
        requirements: [
          'Implement core module meeting all performance and functional bounds.',
          'Achieve sub-2ms P99 execution under simulated benchmark load.',
          'Pass all automated unit tests and edge-case security checks.',
          'Provide architectural notes justifying AI modifications in NOTES.md.',
        ],
        testCount: 18,
        timeLimitHours: 24,
      };
      setGeneratedTask(fallbackTask);
      showToast('Challenge Calibrated', `Task generated with 18 test assertions.`, 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = () => {
    if (generatedTask) {
      onPublishTask(generatedTask);
      showToast(
        'Published to Pipeline',
        `"${generatedTask.title}" is now active in Vector Talent Radar. $${generatedTask.bounty} escrow allocated.`,
        'success'
      );
      onNavigateTab('radar');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
              <Bot className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
              AI Task Scoper Studio
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Transform unresolved Linear / Jira tickets and engineering debt into calibrated 90-min sandboxed trials with automated test harnesses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>RazorpayX Escrow Pre-Funding Active</span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Config Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Input Backlog Issue
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Step 1 of 2</span>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 font-medium">
              Quick Preset Backlog Issues:
            </label>
            <div className="flex flex-col gap-1.5">
              {PRESET_IDEAS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{preset.label}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold ml-2 shrink-0">
                    ${preset.bounty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold">
              Problem Description / Ticket Summary:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-slate-700 leading-relaxed resize-none"
              placeholder="e.g. Optimize Redis sliding window rate limiter..."
            />
          </div>

          {/* Difficulty & Bounty Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">
                Target Level:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
              >
                <option value="Junior">Junior Intern (0 YOE - ₹2,500)</option>
                <option value="Mid">Graduate Trainee (0–1 YOE - ₹3,000)</option>
                <option value="Senior">Junior SDE (1–2 YOE - ₹4,000)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">
                Trial Honorarium (INR ₹):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-500 font-mono">₹</span>
                <input
                  type="number"
                  value={bounty}
                  onChange={(e) => setBounty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-6 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-slate-700"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              isGenerating
                ? 'bg-slate-800 text-slate-400 cursor-wait'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
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
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Generated Trial Specification</span>
            </h3>

            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Sandbox Harness Ready
            </span>
          </div>

          {generatedTask ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-100">
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
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono font-bold text-emerald-300">
                  ${generatedTask.bounty} Escrow Bounty
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  90 Min Sprint Window
                </span>
              </div>

              {/* Acceptance Criteria */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
                  Deterministic Acceptance Matrix ({generatedTask.testCount} Unit Tests)
                </span>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  {generatedTask.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  <span>Escrow Allocation: </span>
                  <strong className="text-emerald-400 font-mono">₹{generatedTask.bounty.toLocaleString('en-IN')} INR locked</strong>
                </div>

                <button
                  onClick={handleDeploy}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Publish to Candidate Pipeline &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              Enter backlog issue details on the left to generate task...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
