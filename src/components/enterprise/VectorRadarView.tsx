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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Query Terminal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
              <Radar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                Vector Talent Radar (pgvector)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time 1,536-dimensional semantic matching against candidate AST abstractions, repository diffs, and work trial track records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>HNSW Index: vector_cosine_ops</span>
          </div>
        </div>

        {/* PostgreSQL Query Preview */}
        <div className="p-3.5 rounded-xl bg-black border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((cand) => {
          const isInvited = !!invitedIds[cand.id];
          return (
            <div
              key={cand.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {cand.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-100 text-sm">
                          {cand.name}
                        </h3>
                        <span className="text-xs text-slate-500 font-mono">
                          {cand.handle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{cand.education}</p>
                    </div>
                  </div>

                  {/* Affinity Badge */}
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                      <Sparkles className="w-3 h-3" />
                      {cand.vectorMatch}% Match
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                      Dist: {cand.cosineDistance.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Target Role & Bounty */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Assigned Challenge:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-xs">{cand.taskName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Trial Compensation:</span>
                    <span className="font-mono text-emerald-400 font-bold">${cand.bounty} USD Escrow</span>
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
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  EVS Benchmark: <strong className="text-slate-200 font-mono">{cand.evsScore}/100</strong>
                </span>

                <button
                  onClick={() => handleInvite(cand)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    isInvited
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700 hover:bg-slate-750'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isInvited ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Review Candidate Dossier &rarr;</span>
                    </>
                  ) : (
                    <>
                      <span>Dispatch 90-Min Trial</span>
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
