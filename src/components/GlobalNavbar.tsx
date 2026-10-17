'use client';

import React from 'react';
import { Code, UserCheck, Briefcase, ShieldCheck, Sparkles } from 'lucide-react';
import { PersonaView } from '../types';

interface GlobalNavbarProps {
  view: PersonaView;
  onViewChange: (view: PersonaView) => void;
  escrowDisbursed?: boolean;
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  view,
  onViewChange,
  escrowDisbursed = false,
}) => {
  return (
    <header className="w-full bg-slate-900 border border-slate-800 p-3.5 sm:p-4 rounded-xl shadow-xl shadow-slate-950/60 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.25)]">
            <Code className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-100">
                VentureForge Enterprise
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                v2.4 PROTOCOL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Autonomous Work-to-Match Protocol
            </p>
          </div>
        </div>
      </div>

      {/* Center Mode Switcher (Pill Toggle) */}
      <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner w-full md:w-auto justify-center">
        <button
          onClick={() => onViewChange('recruiter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            view === 'recruiter'
              ? 'bg-slate-900 text-emerald-400 border border-slate-700/80 shadow-[0_2px_12px_rgba(0,0,0,0.6)] font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <span className="text-sm">👔</span>
          <span>Recruiter View</span>
          <span className="hidden sm:inline text-[11px] text-slate-400 font-normal">
            (Hiring Manager)
          </span>
          {view === 'recruiter' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
          )}
        </button>

        <button
          onClick={() => onViewChange('candidate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            view === 'candidate'
              ? 'bg-slate-900 text-emerald-400 border border-slate-700/80 shadow-[0_2px_12px_rgba(0,0,0,0.6)] font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <span className="text-sm">💻</span>
          <span>Candidate View</span>
          <span className="hidden sm:inline text-[11px] text-slate-400 font-normal">
            (Leo - CS &apos;26)
          </span>
          {view === 'candidate' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
          )}
        </button>
      </div>

      {/* Right Status */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            escrowDisbursed
              ? 'bg-emerald-950 text-emerald-300 border-emerald-600 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {escrowDisbursed
              ? 'Dual-Sided Escrow: $150 Disbursed'
              : 'Dual-Sided Escrow Active: $150 Balance'}
          </span>
        </div>
      </div>
    </header>
  );
};
