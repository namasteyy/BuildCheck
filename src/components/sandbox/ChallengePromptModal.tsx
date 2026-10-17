'use client';

import React from 'react';
import {
  FileText,
  Clock,
  DollarSign,
  Bot,
  AlertTriangle,
  CheckSquare,
  ShieldAlert,
  Code2,
  X,
} from 'lucide-react';

interface ChallengePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChallengePromptModal: React.FC<ChallengePromptModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              OFFICIAL CANDIDATE PROMPT
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Build an AI-Assisted Payment Reconciliation Endpoint
          </h2>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Time Limit: <strong>90 Minutes</strong></span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trial Bounty: <strong className="text-emerald-400">$150 USDC</strong></span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tools: Monaco IDE, Sandbox AI, PyTest</span>
            </span>
          </div>
        </div>

        {/* 1. Problem Statement */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>📋 Problem Statement</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            Your team&apos;s payment service needs a new backend endpoint <code className="text-emerald-300">POST /reconcile</code> that accepts a JSON payload of unverified payment transactions, matches them against internal database invoice IDs, and flags suspicious discrepancies.
          </p>
        </div>

        {/* 2. AI Assistance Rules */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>🤖 AI Assistance Rules (Intentional Flaw Protocol)</span>
          </h3>
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 space-y-2 leading-relaxed">
            <p>
              You are encouraged to use the built-in Sandbox AI Assistant to generate starter code or debug errors. However, <strong>the baseline AI model output contains intentional logical edge cases, security vulnerabilities, and inefficient database queries.</strong>
            </p>
            <p className="font-semibold text-amber-300">
              Your score depends not just on whether unit tests pass, but on how effectively you audit, refactor, and optimize the AI&apos;s suggestions.
            </p>
          </div>
        </div>

        {/* 3. Deliverable Checklist */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>🎯 Deliverable Checklist</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <span className="font-bold text-emerald-400 font-mono">1.</span>
              <p>
                <strong>Functional Correctness:</strong> Pass all automated PyTest unit tests.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="font-bold text-emerald-400 font-mono">2.</span>
              <p>
                <strong>AI Code Refactoring:</strong> Identify and fix 2 hidden edge cases (zero-value payments, duplicate invoice IDs).
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="font-bold text-emerald-400 font-mono">3.</span>
              <p>
                <strong>Security Check:</strong> Ensure input payloads are sanitized against SQL injection / prototype pollution.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="font-bold text-emerald-400 font-mono">4.</span>
              <p>
                <strong>Architectural Note:</strong> Write a 3-sentence summary in <code className="text-emerald-300">NOTES.md</code> explaining why you modified or rejected any AI-generated code.
              </p>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
        >
          Got It — Return to Sandboxed Workspace
        </button>
      </div>
    </div>
  );
};
