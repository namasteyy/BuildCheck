'use client';

import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Users,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Code2,
  Sparkles,
  Bot,
  Radar,
  Terminal,
} from 'lucide-react';
import { CandidateProfile, EnterpriseTab, PipelineMetric } from '../../types';

interface OverviewDashboardProps {
  metrics: PipelineMetric[];
  candidates: CandidateProfile[];
  onNavigateTab: (tab: EnterpriseTab) => void;
  onSelectCandidate: (candidate: CandidateProfile) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  metrics,
  candidates,
  onNavigateTab,
  onSelectCandidate,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Hiring Protocol Active</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Deterministic Engineering Hiring Pipeline
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            Replace resume filtering with sandboxed work trials. Candidates write production code against your test harnesses, verified deterministically with <strong className="text-slate-200">pgvector</strong> similarity and dual-sided escrow.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('scoper')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Scope New Backlog Task</span>
            </button>

            <button
              onClick={() => onNavigateTab('radar')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              <Radar className="w-4 h-4 text-emerald-400" />
              <span>Search Vector Talent Pool</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-lg space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {metric.label}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  metric.trend === 'up'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {metric.change}
              </span>
            </div>

            <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
              {metric.value}
            </div>

            <p className="text-xs text-slate-500 pt-1 border-t border-slate-800/60">
              {metric.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Active Work Trials Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-0">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Live Candidate Work Trials
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Active sandboxed trials verified across deterministic test gates and smart contract escrows.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
              4 Active Trials
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Candidate</th>
                <th className="px-5 py-3">Role &amp; Task</th>
                <th className="px-5 py-3">pgvector Match</th>
                <th className="px-5 py-3">EVS Telemetry</th>
                <th className="px-5 py-3">Trial Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {candidates.map((cand) => {
                let statusBadge = (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-800 text-slate-300">
                    {cand.status}
                  </span>
                );

                if (cand.status === 'verified') {
                  statusBadge = (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Verified (100% Passed)
                    </span>
                  );
                } else if (cand.status === 'offer_extended') {
                  statusBadge = (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      Offer Extended ($200 Disbursed)
                    </span>
                  );
                } else if (cand.status === 'in_progress') {
                  statusBadge = (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                      In Sandbox (1h 10m)
                    </span>
                  );
                } else if (cand.status === 'invited') {
                  statusBadge = (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700/60 flex items-center gap-1.5 w-fit">
                      Invited (Awaiting Claim)
                    </span>
                  );
                }

                return (
                  <tr
                    key={cand.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => {
                      onSelectCandidate(cand);
                      onNavigateTab('sandbox');
                    }}
                  >
                    {/* Candidate */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs">
                          {cand.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{cand.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {cand.handle}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {cand.education}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Task */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-200">
                        {cand.role}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {cand.taskName}
                      </div>
                    </td>

                    {/* Vector Match */}
                    <td className="px-5 py-4 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${cand.vectorMatch}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-emerald-400">
                          {cand.vectorMatch}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        dist: {cand.cosineDistance.toFixed(4)}
                      </span>
                    </td>

                    {/* EVS Telemetry */}
                    <td className="px-5 py-4 font-mono">
                      <div className="font-bold text-slate-200">
                        {cand.evsScore}/100
                      </div>
                      <span className="text-[10px] text-emerald-400">
                        {cand.testPassRate}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {statusBadge}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(cand);
                          onNavigateTab('sandbox');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 font-semibold text-xs border border-slate-800 transition-all cursor-pointer"
                      >
                        <span>Open Sandbox</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
