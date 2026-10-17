'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Bot,
  User,
  Clock,
  Code2,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AIEvaluationResult, AIPromptLog } from '../../types';

interface EvaluatorTelemetryCardProps {
  evaluation: AIEvaluationResult;
  promptLogs: AIPromptLog[];
  notesContent: string;
}

export const EvaluatorTelemetryCard: React.FC<EvaluatorTelemetryCardProps> = ({
  evaluation,
  promptLogs,
  notesContent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'prompt_logs' | 'notes'>('metrics');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-0">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">
                Senior Staff AI Evaluator Report
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {evaluation.hiring_recommendation}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluated on PyTest results, prompt constraint quality, human refactoring ratio, and security audits.
            </p>
          </div>
        </div>

        {/* EVS Total Score Pill */}
        <div className="flex items-center gap-2 font-mono">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Composite EVS</span>
            <span className="text-lg font-bold text-emerald-400">
              {evaluation.evs_total_score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="px-5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2">
        <button
          onClick={() => setActiveSubTab('metrics')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'metrics'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          4-Dimension EVS Breakdown
        </button>

        <button
          onClick={() => setActiveSubTab('prompt_logs')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'prompt_logs'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Interaction Audit ({promptLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'notes'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>NOTES.md Architectural Rationale</span>
        </button>
      </div>

      {/* Sub-tab content */}
      <div className="p-6">
        {activeSubTab === 'metrics' && (
          <div className="space-y-6">
            {/* 4 Dimension Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Functional Score */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">1. Functional Correctness</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {evaluation.functional_score}/100
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${evaluation.functional_score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Automated PyTest assertions passed with zero runtime exceptions.
                </p>
              </div>

              {/* 2. AI Efficiency Score */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">2. AI Efficiency Score</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {evaluation.ai_efficiency_score}/100
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${evaluation.ai_efficiency_score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Iteratively refined prompts with concrete constraints (O(N) bounds, zero-values).
                </p>
              </div>

              {/* 3. Human Refactoring Index */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">3. Human Refactoring Index</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {evaluation.human_refactoring_index}/100
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${evaluation.human_refactoring_index}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  68% manual edits vs 32% raw AI code acceptance. Avoided blind copy-paste.
                </p>
              </div>

              {/* 4. Security & Quality Score */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">4. Security &amp; Code Quality</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {evaluation.security_and_quality_score}/100
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${evaluation.security_and_quality_score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Identified zero-value payment exploit and duplicate invoice re-matching flaw.
                </p>
              </div>
            </div>

            {/* Key Observations */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Senior Staff Key Observations</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {evaluation.key_observations.map((obs, i) => (
                  <li key={i} className="leading-relaxed">
                    {obs}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'prompt_logs' && (
          <div className="space-y-3 font-mono text-xs">
            <p className="text-slate-400 text-[11px]">
              Full audit trail of all prompts candidate dispatched to Sandbox AI Assistant during the 90-minute trial:
            </p>
            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {promptLogs.map((log) => {
                const isCandidate = log.sender === 'candidate';
                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border ${
                      isCandidate
                        ? 'bg-slate-950 border-emerald-500/30 text-emerald-200'
                        : 'bg-black border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-bold">
                        {isCandidate ? 'Candidate Prompt' : 'AI Assistant Response'}
                      </span>
                      <span>{log.timestamp}</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {log.message}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSubTab === 'notes' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">NOTES.md Submission</span>
              <span className="text-emerald-400 font-mono">Verified Architectural Note</span>
            </div>
            <pre className="p-4 rounded-xl bg-black border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {notesContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
