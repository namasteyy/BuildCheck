'use client';

import React, { useState } from 'react';
import { Building2, User, Globe, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

interface DemoPersonaDrawerProps {
  currentScreen: 'landing' | 'enterprise' | 'candidate';
  onNavigateScreen: (screen: 'landing' | 'enterprise' | 'candidate') => void;
}

export const DemoPersonaDrawer: React.FC<DemoPersonaDrawerProps> = ({
  currentScreen,
  onNavigateScreen,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden transition-all">
        {/* Drawer Header Bar */}
        <div className="px-3.5 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Demo Realm Switcher
            </span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded cursor-pointer"
            title={collapsed ? 'Expand drawer' : 'Collapse drawer'}
          >
            {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Drawer Content */}
        {!collapsed && (
          <div className="p-2 space-y-1.5">
            <div className="text-[10px] text-slate-400 px-2 py-0.5">
              Simulating production multi-tenant routing:
            </div>

            <div className="grid grid-cols-3 gap-1.5 min-w-[340px]">
              {/* Landing Page Button */}
              <button
                onClick={() => onNavigateScreen('landing')}
                className={`flex flex-col items-start p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  currentScreen === 'landing'
                    ? 'bg-slate-800 border-emerald-500/50 text-slate-100 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                  <Globe className={`w-3.5 h-3.5 ${currentScreen === 'landing' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Landing</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  /
                </span>
                {currentScreen === 'landing' && (
                  <span className="mt-1 text-[8px] font-semibold text-emerald-400 uppercase tracking-wider">
                    ● Active
                  </span>
                )}
              </button>

              {/* Recruiter Workspace Button */}
              <button
                onClick={() => onNavigateScreen('enterprise')}
                className={`flex flex-col items-start p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  currentScreen === 'enterprise'
                    ? 'bg-slate-800 border-emerald-500/50 text-slate-100 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                  <Building2 className={`w-3.5 h-3.5 ${currentScreen === 'enterprise' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Recruiter</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  /dashboard
                </span>
                {currentScreen === 'enterprise' && (
                  <span className="mt-1 text-[8px] font-semibold text-emerald-400 uppercase tracking-wider">
                    ● Active
                  </span>
                )}
              </button>

              {/* Candidate Work Trial Button */}
              <button
                onClick={() => onNavigateScreen('candidate')}
                className={`flex flex-col items-start p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  currentScreen === 'candidate'
                    ? 'bg-slate-800 border-emerald-500/50 text-slate-100 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                  <User className={`w-3.5 h-3.5 ${currentScreen === 'candidate' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Candidate</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  /eval/inv
                </span>
                {currentScreen === 'candidate' && (
                  <span className="mt-1 text-[8px] font-semibold text-emerald-400 uppercase tracking-wider">
                    ● Active
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
