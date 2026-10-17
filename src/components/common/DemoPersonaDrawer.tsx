'use client';

import React, { useState } from 'react';
import { Building2, User, ChevronUp, ChevronDown, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { PortalMode } from '../../types';

interface DemoPersonaDrawerProps {
  portalMode: PortalMode;
  onPortalModeChange: (mode: PortalMode) => void;
}

export const DemoPersonaDrawer: React.FC<DemoPersonaDrawerProps> = ({
  portalMode,
  onPortalModeChange,
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
              Demo Persona Switcher
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

            <div className="grid grid-cols-2 gap-1.5">
              {/* Recruiter Workspace Button */}
              <button
                onClick={() => onPortalModeChange('enterprise')}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  portalMode === 'enterprise'
                    ? 'bg-slate-800 border-emerald-500/50 text-slate-100 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                  <Building2 className={`w-3.5 h-3.5 ${portalMode === 'enterprise' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Recruiter Portal</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  /dashboard
                </span>
                {portalMode === 'enterprise' && (
                  <span className="mt-1 text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">
                    ● Active View
                  </span>
                )}
              </button>

              {/* Candidate Work Trial Button */}
              <button
                onClick={() => onPortalModeChange('candidate')}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  portalMode === 'candidate'
                    ? 'bg-slate-800 border-emerald-500/50 text-slate-100 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                  <User className={`w-3.5 h-3.5 ${portalMode === 'candidate' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Candidate Trial</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  /eval/inv_8x92fa1
                </span>
                {portalMode === 'candidate' && (
                  <span className="mt-1 text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">
                    ● Active View
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
