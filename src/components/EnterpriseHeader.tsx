'use client';

import React from 'react';
import { Code, Terminal, Layers, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { RoleType } from '../types';

interface EnterpriseHeaderProps {
  activeRole: RoleType;
  onSelectRole: (role: RoleType) => void;
  matchScore: number;
  candidateName: string;
  candidateEducation: string;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({
  activeRole,
  onSelectRole,
  matchScore,
  candidateName,
  candidateEducation,
}) => {
  const roles: { id: RoleType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'swe',
      label: 'Backend Engineering Intern',
      icon: <Terminal className="w-4 h-4" />,
    },
    {
      id: 'pm',
      label: 'Product Management Intern',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'devops',
      label: 'DevOps / Infra Intern',
      icon: <Cpu className="w-4 h-4" />,
    },
  ];

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 px-5 py-3 sticky top-0 z-50 shadow-lg shadow-slate-950/40">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left: Brand title & Subtitle */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.25)]">
              <Code className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-2">
                  BuildCheck Enterprise
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  FAST-TRACK HIRING
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Intern &amp; Junior Placement Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: Interactive Role Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner w-full lg:w-auto justify-center overflow-x-auto">
          {roles.map((role) => {
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-emerald-400 border border-slate-700/80 shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                  {role.icon}
                </span>
                <span>{role.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Candidate Match Pill & Glowing Badge */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Candidate Match Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span className="text-slate-400">Candidate:</span>
            <span className="font-semibold text-slate-100">
              {candidateName} ({candidateEducation})
            </span>
          </div>

          {/* Glowing Badge: 94% Vector Match (pgvector) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 glow-pill shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>{matchScore}% Vector Match</span>
            <span className="text-[10px] text-emerald-400/80 font-mono font-normal">
              (pgvector)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
