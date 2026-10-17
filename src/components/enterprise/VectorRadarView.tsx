'use client';

import React, { useState } from 'react';
import {
  Radar,
  Database,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Filter,
  Search,
  ExternalLink,
  Code2,
  Check,
  Award,
} from 'lucide-react';
import { CandidateProfile, EnterpriseTab } from '../../types';

interface VectorRadarViewProps {
  candidates: CandidateProfile[];
  onSelectCandidate: (candidate: CandidateProfile) => void;
  onNavigateTab: (tab: EnterpriseTab) => void;
}

export const VectorRadarView: React.FC<VectorRadarViewProps> = ({
  candidates,
  onSelectCandidate,
  onNavigateTab,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile>(candidates[0]);
  const [invitedIds, setInvitedIds] = useState<Record<string, boolean>>({
    'cand-1': true,
  });

  const handleInvite = (cand: CandidateProfile) => {
    setInvitedIds((prev) => ({ ...prev, [cand.id]: true }));
    onSelectCandidate(cand);
    onNavigateTab('sandbox');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Query Terminal */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Radar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                Vector Talent Radar (pgvector)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time 1,536-dimensional semantic matching against GitHub commits, AST abstractions, and chaos test track records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400">
            <Database className="w-3.5 h-3.5" />
            <span>HNSW Index: vector_cosine_ops</span>
          </div>
        </div>

        {/* PostgreSQL Query Preview */}
        <div className="p-3.5 rounded-xl bg-black border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto">
          <span className="text-slate-500">-- PostgreSQL 16 + pgvector cosine proximity query</span>
          <pre className="text-emerald-400 mt-1">
{`SELECT candidate_id, name, 1 - (code_embedding <=> $task_embedding) AS vector_affinity
FROM candidate_work_graph
WHERE verified_sandbox_pass = true AND availability_window = '24h'
ORDER BY code_embedding <=> $task_embedding ASC
LIMIT 4;`}
          </pre>
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((cand) => {
          const isInvited = !!invitedIds[cand.id];
          return (
            <div
              key={cand.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold font-mono text-base shadow-inner">
                      {cand.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-100 text-base">
                          {cand.name}
                        </h3>
                        <span className="text-xs font-mono text-slate-400">
                          {cand.handle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{cand.education}</p>
                    </div>
                  </div>

                  {/* Affinity Badge */}
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs shadow-[0_0_12px_rgba(52,211,153,0.2)]">
                      <Sparkles className="w-3.5 h-3.5" />
                      {cand.vectorMatch}% Match
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                      Dist: {cand.cosineDistance.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Target Role & Bounty */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Assigned Challenge:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-xs">{cand.taskName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Trial Bounty:</span>
                    <span className="font-mono text-emerald-400 font-bold">${cand.bounty} USDC Escrow</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cand.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  EVS Score: <strong className="text-slate-200">{cand.evsScore}/100</strong>
                </span>

                <button
                  onClick={() => handleInvite(cand)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isInvited
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-slate-750'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  }`}
                >
                  {isInvited ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Open Candidate Sandbox &rarr;</span>
                    </>
                  ) : (
                    <>
                      <span>Invite to 24-Hr Trial Sprint</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
