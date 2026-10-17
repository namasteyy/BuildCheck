'use client';

import React, { useState } from 'react';
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
  Plus,
  CreditCard,
  X,
  Sun,
  Moon,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { EnterpriseTab, PortalMode } from '../../types';
import { useToast } from '../common/Toast';

interface TopNavProps {
  activeTab: EnterpriseTab;
  onTabChange: (tab: EnterpriseTab) => void;
  portalMode: PortalMode;
  onPortalModeChange?: (mode: PortalMode) => void;
  escrowTotal: number;
  onTopUpEscrow?: (amount: number) => void;
  onReturnHome?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  portalMode,
  onPortalModeChange,
  escrowTotal,
  onTopUpEscrow,
  onReturnHome,
}) => {
  const { showToast } = useToast();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(50000);
  const [isDark, setIsDark] = useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextDark = document.documentElement.classList.toggle('dark');
    setIsDark(nextDark);
    showToast(nextDark ? '🌙 Dark Mode Activated' : '☀️ Bright Mode Activated', 'info');
  };

  const enterpriseTabs: { id: EnterpriseTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Pipeline Overview',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    {
      id: 'drives',
      label: 'Campus Drives',
      icon: <Briefcase className="w-3.5 h-3.5" />,
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
      badge: 'Kabir M. (96 EVS)',
    },
    {
      id: 'escrow',
      label: 'Escrow & Offer Desk',
      icon: <FileCheck2 className="w-3.5 h-3.5" />,
    },
  ];

  const handleConfirmTopUp = () => {
    if (onTopUpEscrow) {
      onTopUpEscrow(topUpAmount);
    }
    showToast(
      'Escrow Vault Funded',
      `₹${topUpAmount.toLocaleString('en-IN')}.00 INR successfully deposited via RazorpayX corporate balance.`,
      'success'
    );
    setShowTopUpModal(false);
  };

  if (portalMode === 'tpo_admin') {
    // Dedicated Header for Institute Training & Placement Office (TPO)
    return (
      <header className="w-full bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-400 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-100 tracking-tight">
                  IIIT Delhi &bull; Placement Cell
                </span>
                <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-bold">
                  TPO Admin
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {onPortalModeChange && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
                <button
                  onClick={() => onPortalModeChange('candidate')}
                  className="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Student
                </button>
                <button
                  onClick={() => onPortalModeChange('enterprise')}
                  className="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Recruiter
                </button>
                <button
                  onClick={() => onPortalModeChange('tpo_admin')}
                  className="px-2 py-0.5 rounded bg-blue-500 text-slate-950 font-bold transition-colors cursor-pointer"
                >
                  TPO Admin
                </button>
              </div>
            )}

            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
            </button>

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
                  BuildCheck Sandboxed Trial
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Invite Verified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {onPortalModeChange && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
                <button
                  onClick={() => onPortalModeChange('candidate')}
                  className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold transition-colors cursor-pointer"
                >
                  Student
                </button>
                <button
                  onClick={() => onPortalModeChange('enterprise')}
                  className="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Recruiter
                </button>
                <button
                  onClick={() => onPortalModeChange('tpo_admin')}
                  className="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  TPO Admin
                </button>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Sponsor: <strong className="text-slate-100">Razorpay Labs</strong></span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>₹3,000 Trial Stipend Locked</span>
            </div>

            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
            </button>

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
    <>
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
                  BuildCheck
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  Enterprise
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800/80">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-200">Razorpay Labs</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-slate-400">Core Engineering Hiring</span>
              </div>
            </div>
          </div>

          {/* Right Section: Escrow Vault & Compliance Posture */}
          <div className="flex items-center gap-3">
            {onPortalModeChange && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
                <button
                  onClick={() => onPortalModeChange('candidate')}
                  className="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Student
                </button>
                <button
                  onClick={() => onPortalModeChange('enterprise')}
                  className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold transition-colors cursor-pointer"
                >
                  Recruiter
                </button>
                <button
                  onClick={() => onPortalModeChange('tpo_admin')}
                  className="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  TPO Admin
                </button>
              </div>
            )}

            {/* Escrow Funded Badge with Top Up button */}
            <div className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 hidden sm:inline">Escrow:</span>
              <span className="font-bold text-slate-100 font-mono">₹{escrowTotal.toLocaleString('en-IN')}</span>
              <button
                onClick={() => setShowTopUpModal(true)}
                title="Top Up Escrow Vault"
                className="ml-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-slate-700/60 hover:border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>Top Up</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 px-2 py-0.5 rounded bg-slate-900/40 border border-slate-800/60">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>RazorpayX Escrow</span>
            </div>

            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {onReturnHome && (
              <button
                onClick={onReturnHome}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer text-xs"
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

      {/* Top Up Escrow Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Top Up Escrow Vault
                </h3>
              </div>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Pre-fund your organization's RazorpayX bank escrow account to guarantee paid engineering trials:
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {[25000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-mono font-bold ${
                      topUpAmount === amt
                        ? 'bg-slate-800 text-emerald-400 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    +₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Balance:</span>
                  <span className="font-mono text-slate-200 font-bold">₹{escrowTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deposit Amount:</span>
                  <span className="font-mono text-emerald-400 font-bold">+₹{topUpAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-300 font-semibold">New Escrow Total:</span>
                  <span className="font-mono text-emerald-400 font-bold">₹{(escrowTotal + topUpAmount).toLocaleString('en-IN')} INR</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowTopUpModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTopUp}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Deposit via RazorpayX</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
