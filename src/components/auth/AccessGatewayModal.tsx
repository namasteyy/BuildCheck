'use client';

import React, { useState } from 'react';
import {
  Building2,
  User,
  X,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Code2,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

interface AccessGatewayModalProps {
  isOpen: boolean;
  initialRole?: 'recruiter' | 'candidate';
  onClose: () => void;
  onSelectRole: (role: 'recruiter' | 'candidate') => void;
}

export const AccessGatewayModal: React.FC<AccessGatewayModalProps> = ({
  isOpen,
  initialRole = 'recruiter',
  onClose,
  onSelectRole,
}) => {
  const [activeTab, setActiveTab] = useState<'recruiter' | 'candidate'>(initialRole);
  const [workEmail, setWorkEmail] = useState('alex.vance@stripelabs.com');
  const [tokenInput, setTokenInput] = useState('inv_8x92fa1');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
              VentureForge Access Gateway
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">
            Sign In to Your Workspace
          </h2>
          <p className="text-xs text-slate-400">
            Select your operational role or use 1-click verified demo presets to explore.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="p-2 bg-slate-950 border-b border-slate-800 flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'recruiter'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className={`w-3.5 h-3.5 ${activeTab === 'recruiter' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Recruiter / Employer</span>
          </button>

          <button
            onClick={() => setActiveTab('candidate')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'candidate'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className={`w-3.5 h-3.5 ${activeTab === 'candidate' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Candidate / Engineer</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'recruiter' ? (
            /* Recruiter Login Flow */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">
                  Corporate Work Email:
                </label>
                <input
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="alex.vance@stripelabs.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                />
              </div>

              <button
                onClick={() => onSelectRole('recruiter')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Continue with Google Workspace / Okta SSO</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                  Instant Demo Preset
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* 1-Click Demo Recruiter Box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Demo as Stripe Labs Hiring Lead</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">$1,200 Escrow Funded</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Inspect the live candidate pipeline, backlog scoper studio, and Leo M.&apos;s Senior Staff AI evaluation dossier.
                </p>
                <button
                  onClick={() => onSelectRole('recruiter')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Launch Recruiter Portal &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            /* Candidate Login Flow */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">
                  Trial Invite Token / Magic Link:
                </label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="inv_8x92fa1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                />
              </div>

              <button
                onClick={() => onSelectRole('candidate')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                <span>Continue with GitHub Account</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                  Instant Demo Preset
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* 1-Click Demo Candidate Box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Claim Trial as Leo M. (CS &apos;26)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">$150 Bounty Guaranteed</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Experience the 90-minute sandboxed Monaco IDE, built-in AI assistant, and automated PyTest runner for <code className="text-slate-300">POST /reconcile</code>.
                </p>
                <button
                  onClick={() => onSelectRole('candidate')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Enter 90-Min Trial Workspace &rarr;</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
