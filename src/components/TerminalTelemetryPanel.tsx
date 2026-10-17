'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Activity,
  Sparkles,
  Database,
  Trash2,
  Send,
  Zap,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { RoleConfig } from '../types';

interface TerminalTelemetryPanelProps {
  role: RoleConfig;
  customLogs: { timestamp: string; type: string; message: string }[];
  onAddLog: (type: 'info' | 'success' | 'warn' | 'vector', message: string) => void;
  isRunningTest: boolean;
}

export const TerminalTelemetryPanel: React.FC<TerminalTelemetryPanelProps> = ({
  role,
  customLogs,
  onAddLog,
  isRunningTest,
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'telemetry'>('terminal');
  const [commandInput, setCommandInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const allLogs = [...role.logs, ...customLogs];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allLogs.length, isRunningTest]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    const time = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);
    onAddLog('info', `$ ${cmd}`);

    setTimeout(() => {
      const respTime = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);
      if (cmd.toLowerCase().includes('vector') || cmd.toLowerCase().includes('match')) {
        onAddLog(
          'vector',
          `pgvector: 1536-dim embedding similarity = 0.${role.matchScore}4 (distance: ${role.vectorDistance.toFixed(4)})`
        );
      } else if (cmd.toLowerCase().includes('test') || cmd.toLowerCase().includes('run')) {
        onAddLog('success', `Verification test suite: 100% assertions passed. Zero runtime exceptions.`);
      } else if (cmd.toLowerCase().includes('help')) {
        onAddLog('info', `Available commands: 'vector match', 'run test', 'bench', 'pgvector info', 'clear'`);
      } else {
        onAddLog('info', `Command executed: "${cmd}". Sandbox status: NOMINAL.`);
      }
    }, 400);

    setCommandInput('');
  };

  return (
    <div className="h-[620px] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-slate-950/60">
      {/* Panel Navigation & Controls */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-slate-950 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Terminal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-slate-950 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry & pgvector</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono">
              {role.matchScore}%
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>HNSW index: cosine</span>
          </span>
        </div>
      </div>

      {activeTab === 'terminal' ? (
        /* Terminal View */
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 select-text">
            <div className="text-slate-500 text-[11px] pb-2 border-b border-slate-800/80 flex items-center justify-between">
              <span>VentureForge Sandbox Telemetry Console [Session: vf-auth-810]</span>
              <span className="text-emerald-400/80">CONNECTED</span>
            </div>

            {allLogs.map((log, index) => {
              let badgeColor = 'text-slate-400 bg-slate-900 border-slate-800';
              let textColor = 'text-slate-300';

              if (log.type === 'vector') {
                badgeColor = 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30';
                textColor = 'text-emerald-200 font-semibold';
              } else if (log.type === 'success') {
                badgeColor = 'text-emerald-400 bg-emerald-950/20 border-emerald-500/20';
                textColor = 'text-emerald-300';
              } else if (log.type === 'warn') {
                badgeColor = 'text-amber-400 bg-amber-950/20 border-amber-500/20';
                textColor = 'text-amber-300';
              }

              return (
                <div key={index} className="flex items-start gap-2.5 leading-relaxed group">
                  <span className="text-slate-600 select-none text-[10px] pt-0.5 whitespace-nowrap">
                    {log.timestamp}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider ${badgeColor}`}
                  >
                    {log.type}
                  </span>
                  <span className={`flex-1 break-all ${textColor}`}>
                    {log.message}
                  </span>
                </div>
              );
            })}

            {isRunningTest && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs animate-pulse pt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Executing automated verification test harness...</span>
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Quick command buttons & Terminal input */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
              <span className="text-slate-500 text-[10px] uppercase font-mono mr-1">
                Quick Run:
              </span>
              {['vector match', 'run test', 'bench', 'pgvector info'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setCommandInput(cmd);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800 font-mono text-[11px] transition-colors cursor-pointer whitespace-nowrap"
                >
                  ${cmd}
                </button>
              ))}
            </div>

            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
              <span className="text-emerald-400 font-mono font-bold">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Enter telemetry command (e.g. 'run test', 'vector match')..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
              />
              <button
                type="submit"
                className="p-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Send command"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Telemetry & pgvector Radar View */
        <div className="flex-1 overflow-y-auto p-5 bg-slate-950 space-y-5">
          {/* Top Score Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  pgvector High-Affinity Match
                </span>
              </div>
              <p className="text-xl font-bold text-slate-100 mt-1">
                {role.matchScore}% Candidate Affinity
              </p>
              <p className="text-xs text-slate-400">
                Cosine Distance: {role.vectorDistance.toFixed(4)} • Threshold &lt; 0.1000
              </p>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                TOP 6% COHORT
              </span>
            </div>
          </div>

          {/* Dimension Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Vector Dimension Projections
            </h4>
            <div className="space-y-3">
              {role.vectorBreakdown.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-200">{item.dimension}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400">{item.score}%</span>
                      <span className="text-[10px] text-slate-500">
                        (Benchmark: {item.benchmark}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work-to-Match Protocol Audit Card */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Autonomous Verification Criteria
            </h4>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>
                Work sample matches production codebase standards under simulated chaos.
              </li>
              <li>
                Vector embedding computed across 1,536 code token dimensions in PostgreSQL.
              </li>
              <li>
                Deterministic test run verified across isolated ephemeral Docker sandboxes.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
