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
  GitCompare,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { AIEvaluationResult, AIPromptLog } from '../../types';
import { useToast } from '../common/Toast';

interface EvaluatorTelemetryCardProps {
  evaluation: AIEvaluationResult;
  promptLogs: AIPromptLog[];
  notesContent: string;
  candidateName?: string;
  taskName?: string;
}

export const EvaluatorTelemetryCard: React.FC<EvaluatorTelemetryCardProps> = ({
  evaluation,
  promptLogs = [],
  notesContent = '',
  candidateName = 'Kabir Mehra',
  taskName = 'Payment Reconciliation API Latency Optimization',
}) => {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'diff' | 'prompt_logs' | 'notes'>('metrics');
  const [copiedNote, setCopiedNote] = useState(false);

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(notesContent);
    setCopiedNote(true);
    showToast('Copied', 'NOTES.md architectural rationale copied.', 'info');
    setTimeout(() => setCopiedNote(false), 2000);
  };

  const safePromptLogs = promptLogs && promptLogs.length > 0 ? promptLogs : [
    {
      id: '1',
      timestamp: '22:31:04',
      sender: 'candidate' as const,
      message: `Generate starter code for ${taskName} with basic error handling.`,
    },
    {
      id: '2',
      timestamp: '22:31:06',
      sender: 'assistant' as const,
      message: `Here is the baseline implementation for ${taskName}. Note: Ensure all edge-case validations and security bounds are hardened before production submission.\n\n\`\`\`python\ndef reconcile_invoices(invoices, payments):\n    matched_ids = []\n    for inv in invoices:\n        for pay in payments:\n            if inv["id"] == pay["id"] and inv["amt"] == pay["paid"]:\n                matched_ids.append(inv["id"])\n    return matched_ids\n\`\`\``,
      containedCode: true,
    },
    {
      id: '3',
      timestamp: '22:33:18',
      sender: 'candidate' as const,
      message: 'How should we guard against zero-value payment exploits and duplicate invoice injections in O(N)?',
    },
    {
      id: '4',
      timestamp: '22:33:20',
      sender: 'assistant' as const,
      message: 'AI Engineering Advice: Filter out zero payments where paid <= 0, and use a hash set of processed IDs to guarantee O(N) linear time deduplication.',
    },
  ];

  const safeNotes = notesContent && notesContent.trim().length > 0 ? notesContent : `# Architectural Decisions & AI Refactoring Notes
**Candidate:** ${candidateName}
**Task:** ${taskName}

### AI Code Modifications & Refactoring Rationale
1. **Zero-Value Payment Exploit:** Baseline AI code accepted zero and negative payment amounts (amt == paid == 0). Added explicit guards (pay['paid'] > 0) to prevent unauthorized invoice closure.
2. **Duplicate Injection Vulnerability:** The baseline nested loop re-matched duplicate payments against the same invoice ID. Refactored lookup to an O(n) hash set with deduplication.
3. **Time Complexity:** Replaced O(N*M) nested scan with indexed hashmap lookup, reducing P99 latency from 18ms to 1.1ms for 10,000 transactions.
`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden space-y-0">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">
                Automated Engineering Evaluation Dossier &bull; {candidateName}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                {evaluation.hiring_recommendation || 'FAST_TRACK_OFFER'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic evaluation across unit test coverage, AI prompt refinement, code churn diffs, and security guards.
            </p>
          </div>
        </div>

        {/* EVS Total Score Pill */}
        <div className="flex items-center gap-2 font-mono">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Composite EVS</span>
            <span className="text-xl font-bold text-emerald-400">
              {evaluation.evs_total_score || 96} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="px-4 sm:px-5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('metrics')}
          className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'metrics'
              ? 'border-emerald-400 text-slate-100 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          4-Dimension EVS Rubric
        </button>

        <button
          onClick={() => setActiveSubTab('diff')}
          className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'diff'
              ? 'border-emerald-400 text-slate-100 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5 text-slate-400" />
          <span>Code Refactoring Diff</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prompt_logs')}
          className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'prompt_logs'
              ? 'border-emerald-400 text-slate-100 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-slate-400" />
          <span>AI Interaction Audit ({safePromptLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'notes'
              ? 'border-emerald-400 text-slate-100 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>NOTES.md Architectural Rationale</span>
        </button>
      </div>

      {/* Sub-tab content */}
      <div className="p-5 sm:p-6">
        {activeSubTab === 'metrics' && (
          <div className="space-y-5">
            {/* 4 Dimension Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* 1. Functional Score */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
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
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
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
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
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
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
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
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automated Engineering Observations</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {(evaluation.key_observations || []).map((obs, i) => (
                  <li key={i} className="leading-relaxed">
                    {obs}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'diff' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Comparing: <code className="text-red-400">baseline_ai_output.py</code> &rarr; <code className="text-emerald-400">candidate_solution.py</code></span>
              <span className="text-slate-500 font-sans">+8 additions, -4 deletions &bull; O(1) space, O(N) time</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs leading-relaxed space-y-0.5 font-mono select-text">
              <div className="text-slate-500">@@ def reconcile_invoices(invoices, payments): @@</div>
              <div className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;matched_ids = []</div>
              <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded">+&nbsp;&nbsp;&nbsp;seen = set()</div>
              <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded">+&nbsp;&nbsp;&nbsp;# Filter valid positive payments (reject zero/negative exploit)</div>
              <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded">+&nbsp;&nbsp;&nbsp;valid_payments = &#123;p['id']: p['paid'] for p in payments if p.get('paid', 0) &gt; 0&#125;</div>
              <div className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;for inv in invoices:</div>
              <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded">+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inv_id = inv.get('id')</div>
              <div className="text-red-400 bg-red-950/40 px-1 rounded">-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for pay in payments:</div>
              <div className="text-red-400 bg-red-950/40 px-1 rounded">-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if inv['id'] == pay['id'] and inv['amt'] == pay['paid']:</div>
              <div className="text-red-400 bg-red-950/40 px-1 rounded">-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matched_ids.append(inv['id'])</div>
              <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded">+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if inv_id not in seen and valid_payments.get(inv_id) == inv.get('amt'):</div>
              <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded">+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matched_ids.append(inv_id)</div>
              <div className="text-emerald-400 bg-emerald-950/40 px-1 rounded">+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;seen.add(inv_id)</div>
              <div className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;return matched_ids</div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-sans">
              <strong className="text-slate-200">Refactoring Verdict:</strong> {candidateName} detected that baseline AI code lacked payment amount sanity checking and duplicated invoice matches. Replaced nested loop with dictionary lookup, optimizing from O(N&times;M) to O(N).
            </div>
          </div>
        )}

        {activeSubTab === 'prompt_logs' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
              <span>Full chronological transcript of all candidate queries and AI responses:</span>
              <span className="text-emerald-400 font-mono">{safePromptLogs.length} Prompts Audited</span>
            </div>
            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {safePromptLogs.map((log) => {
                const isCandidate = log.sender === 'candidate';
                return (
                  <div
                    key={log.id}
                    className={`p-3.5 rounded-xl border ${
                      isCandidate
                        ? 'bg-slate-950 border-emerald-500/30 text-emerald-200'
                        : 'bg-black border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                      <span className="font-bold flex items-center gap-1.5">
                        {isCandidate ? (
                          <>
                            <User className="w-3 h-3 text-emerald-400" />
                            <span>{candidateName} Prompt</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-3 h-3 text-blue-400" />
                            <span>AI Assistant Output</span>
                          </>
                        )}
                      </span>
                      <span>{log.timestamp}</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                      {log.message}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSubTab === 'notes' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">NOTES.md Submission</span>
              <button
                onClick={handleCopyNotes}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 px-2 py-1 rounded cursor-pointer"
              >
                {copiedNote ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedNote ? 'Copied' : 'Copy Rationale'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-black border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
              {safeNotes}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
