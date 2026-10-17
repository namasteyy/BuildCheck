'use client';

import React from 'react';
import {
  Code2,
  LayoutDashboard,
  Bot,
  Radar,
  Terminal,
  FileCheck2,
  ShieldCheck,
  Building2,
  User,
  ChevronDown,
  Bell,
  ArrowRightLeft,
} from 'lucide-react';
import { EnterpriseTab, PortalMode } from '../../types';

interface TopNavProps {
  activeTab: EnterpriseTab;
  onTabChange: (tab: EnterpriseTab) => void;
  portalMode: PortalMode;
  onPortalModeChange: (mode: PortalMode) => void;
  escrowTotal: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  portalMode,
  onPortalModeChange,
  escrowTotal,
}) => {
  const tabs: { id: EnterpriseTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Pipeline Overview',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    {
      id: 'scoper',
      label: 'AI Scoper Studio',
      icon: <Bot className="w-3.5 h-3.5" />,
    },
    {
      id: 'radar',
      label: 'Vector Talent Radar',
      icon: <Radar className="w-3.5 h-3.5" />,
    },
    {
      id: 'sandbox',
      label: 'Live Work Sandbox',
      icon: <Terminal className="w-3.5 h-3.5" />,
    },
    {
      id: 'escrow',
      label: 'Escrow & Offer Desk',
      icon: <FileCheck2 className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header className="w-full bg-slate-900/95 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Organization */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.35)]">
              <Code2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100 tracking-tight">
                  VentureForge
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Autonomous Work-to-Match Protocol
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">Stripe Labs</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-slate-400">Core Payments</span>
            </div>
          </div>
        </div>

        {/* Right Section: Escrow Badge & Portal Switcher */}
        <div className="flex items-center gap-3">
          {/* Dual-Sided Escrow Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono font-semibold text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.15)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Vault: ${escrowTotal.toLocaleString()} USDC</span>
          </div>

          {/* Mode Switcher: Recruiter / Candidate */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onPortalModeChange('enterprise')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                portalMode === 'enterprise'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Enterprise Portal</span>
              <span className="md:hidden">Enterprise</span>
            </button>
            <button
              onClick={() => onPortalModeChange('candidate')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                portalMode === 'candidate'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Candidate View</span>
              <span className="md:hidden">Candidate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs (Only shown in Enterprise portal mode) */}
      {portalMode === 'enterprise' && (
        <div className="border-t border-slate-800/80 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/80 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
