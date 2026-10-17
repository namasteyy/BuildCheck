'use client';

import React from 'react';
import {
  Code2,
  LayoutDashboard,
  Bot,
  Radar,
  FileCheck2,
  ShieldCheck,
  Building2,
  User,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
} from 'lucide-react';
import { EnterpriseTab, PortalMode } from '../../types';

interface TopNavProps {
  activeTab: EnterpriseTab;
  onTabChange: (tab: EnterpriseTab) => void;
  portalMode: PortalMode;
  onPortalModeChange?: (mode: PortalMode) => void;
  escrowTotal: number;
  onReturnHome?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  portalMode,
  escrowTotal,
  onReturnHome,
}) => {
  const enterpriseTabs: { id: EnterpriseTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Pipeline Overview',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    {
      id: 'scoper',
      label: 'Task Scoper Studio',
      icon: <Bot className="w-3.5 h-3.5" />,
    },
    {
      id: 'radar',
      label: 'Vector Talent Radar',
      icon: <Radar className="w-3.5 h-3.5" />,
    },
    {
      id: 'sandbox',
      label: 'Evaluation Dossier',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      badge: 'Leo M. (96 EVS)',
    },
    {
      id: 'escrow',
      label: 'Escrow & Offer Desk',
      icon: <FileCheck2 className="w-3.5 h-3.5" />,
    },
  ];

  if (portalMode === 'candidate') {
    // Dedicated, distraction-free header for candidate work trial
    return (
      <header className="w-full bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-100 tracking-tight">
                  VentureForge Sandboxed Trial
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  inv_8x92fa1
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Sponsor: <strong className="text-slate-100">Stripe Labs</strong></span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>$150 Escrow Bounty Locked</span>
            </div>

            {onReturnHome && (
              <button
                onClick={onReturnHome}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer text-xs"
              >
                Exit to Home
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Recruiter Enterprise Navigation
  return (
    <header className="w-full bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
      {/* Primary Brand & Context Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Workspace Organization */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100 tracking-tight">
                VentureForge
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Enterprise
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800/80">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-200">Stripe Labs</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">Core Payments Hiring</span>
            </div>
          </div>
        </div>

        {/* Right Section: Escrow Vault & Compliance Posture */}
        <div className="flex items-center gap-3">
          {/* Escrow Funded Badge (Matte, No Neon Glows) */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Escrow Balance:</span>
            <span className="font-bold text-slate-100">${escrowTotal.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">&bull; Stripe Escrow</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 px-2 py-0.5 rounded bg-slate-900/40 border border-slate-800/60">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>SOC2 Type II</span>
          </div>

          {onReturnHome && (
            <button
              onClick={onReturnHome}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer text-xs"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1">
          {enterpriseTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/90 text-slate-100 border border-slate-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {isActive && !tab.badge && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
