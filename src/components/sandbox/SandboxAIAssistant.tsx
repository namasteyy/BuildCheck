'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { AIPromptLog } from '../../types';

interface SandboxAIAssistantProps {
  logs: AIPromptLog[];
  onAddLog: (sender: 'candidate' | 'assistant', message: string, containedCode?: boolean) => void;
  onApplyCode: (snippet: string) => void;
}

export const SandboxAIAssistant: React.FC<SandboxAIAssistantProps> = ({
  logs,
  onAddLog,
  onApplyCode,
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSend = (userQuery?: string) => {
    const query = (userQuery || input).trim();
    if (!query) return;

    onAddLog('candidate', query);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = query.toLowerCase();

      if (lower.includes('starter') || lower.includes('generate') || lower.includes('begin')) {
        const rawCode = `def reconcile_invoices(invoices, payments):
    # Baseline AI Generated Solution (Caution: Contains edge-case flaws)
    matched_ids = []
    for inv in invoices:
        for pay in payments:
            if inv['id'] == pay['id'] and inv['amt'] == pay['paid']:
                matched_ids.append(inv['id'])
    return matched_ids`;

        onAddLog(
          'assistant',
          `Here is starter code for reconcile_invoices. Note: Check edge-case validation and performance bounds before submitting.\n\n\`\`\`python\n${rawCode}\n\`\`\``,
          true
        );
      } else if (lower.includes('edge') || lower.includes('zero') || lower.includes('duplicate')) {
        const refactoredCode = `def reconcile_invoices(invoices, payments):
    # Refactored: Guards against zero-value payments and duplicate matches
    matched_ids = []
    seen = set()
    
    # Filter valid positive payments
    valid_payments = {p['id']: p['paid'] for p in payments if p.get('paid', 0) > 0}
    
    for inv in invoices:
        inv_id = inv.get('id')
        if inv_id not in seen and valid_payments.get(inv_id) == inv.get('amt'):
            matched_ids.append(inv_id)
            seen.add(inv_id)
            
    return matched_ids`;

        onAddLog(
          'assistant',
          `Audit analysis: The naive solution accepted zero-value payments and produced duplicate matches. Here is a refactored implementation with guards:\n\n\`\`\`python\n${refactoredCode}\n\`\`\``,
          true
        );
      } else if (lower.includes('optimize') || lower.includes('complexity') || lower.includes('o(n)')) {
        const optimizedCode = `def reconcile_invoices(invoices, payments):
    # O(N) Hash Index Reconciliation with Deduplication
    matched_ids = []
    seen = set()
    payment_map = {}
    
    for p in payments:
        if p.get('paid', 0) > 0:
            payment_map[p['id']] = p['paid']
            
    for inv in invoices:
        i_id = inv.get('id')
        if i_id not in seen and payment_map.get(i_id) == inv.get('amt'):
            matched_ids.append(i_id)
            seen.add(i_id)
            
    return matched_ids`;

        onAddLog(
          'assistant',
          `Replaced O(N*M) nested loop with O(N) hashmap lookup. P99 latency will drop from ~18ms to <1.5ms:\n\n\`\`\`python\n${optimizedCode}\n\`\`\``,
          true
        );
      } else {
        onAddLog(
          'assistant',
          `I analyzed your prompt: "${query}". Ensure all zero-value payments (paid <= 0) are filtered out, duplicate invoice IDs are deduplicated, and document your rationale in NOTES.md.`
        );
      }
    }, 600);
  };

  const quickPrompts = [
    'Generate starter code for /reconcile',
    'Identify hidden edge cases (zero values, duplicates)',
    'Optimize nested loop to O(N) hashmap',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>Sandbox AI Assistant</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ALLOWED
              </span>
            </span>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">GPT-4o Sandbox</span>
      </div>

      {/* Warning Notice: Intentional flaws */}
      <div className="px-3.5 py-2.5 bg-amber-950/30 border-b border-amber-500/20 flex items-start gap-2.5 text-[11px] text-amber-300">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>AI Assistance Notice:</strong> Baseline AI output contains intentional edge-case flaws (zero-value payments &amp; duplicate bugs). You are evaluated on how effectively you refactor it.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 font-sans text-xs">
        {logs.map((log) => {
          const isCandidate = log.sender === 'candidate';
          return (
            <div
              key={log.id}
              className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-500">
                <span>{isCandidate ? 'Candidate (@leom-dev)' : 'Sandbox Assistant'}</span>
                <span>&bull;</span>
                <span>{log.timestamp}</span>
              </div>

              <div
                className={`p-3 rounded-xl max-w-[92%] leading-relaxed ${
                  isCandidate
                    ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-100 rounded-br-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-bl-none'
                }`}
              >
                {log.containedCode ? (
                  <div className="space-y-2">
                    <p>{log.message.split('```')[0]}</p>
                    {log.message.includes('```') && (
                      <div className="relative rounded-lg bg-black p-3 font-mono text-[11px] text-slate-200 border border-slate-850">
                        <pre className="overflow-x-auto whitespace-pre">
                          {log.message.split('```')[1]?.replace(/^python\n/, '')}
                        </pre>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-900">
                          <button
                            onClick={() =>
                              onApplyCode(log.message.split('```')[1]?.replace(/^python\n/, ''))
                            }
                            className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition-colors cursor-pointer"
                          >
                            Insert into solution.py
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{log.message}</p>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic font-mono">
            <RotateCcw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>AI generating audited response...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">Prompts:</span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="text-[11px] px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Assistant with specific constraints..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60"
        />
        <button
          onClick={() => handleSend()}
          className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
