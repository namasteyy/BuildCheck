'use client';

import React, { useState } from 'react';
import {
  FileCode,
  CheckCircle,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { RoleConfig } from '../types';

interface WorkspacePanelProps {
  role: RoleConfig;
  onRunTest: () => void;
  isRunningTest: boolean;
}

export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({
  role,
  onRunTest,
  isRunningTest,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile = role.files[activeFileIndex] || role.files[0];

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[620px] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-slate-950/60">
      {/* Workspace Panel Header */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
                Workspace Panel
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700/60">
                {role.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-md">
              {role.sprintName}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRunTest}
            disabled={isRunningTest}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isRunningTest
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-wait animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-[0_0_15px_rgba(52,211,153,0.4)] cursor-pointer'
            }`}
          >
            {isRunningTest ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Verification</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* File Navigation Tabs */}
      <div className="flex items-center justify-between px-3 bg-slate-950/70 border-b border-slate-800 overflow-x-auto">
        <div className="flex items-center gap-1 py-1.5">
          {role.files.map((file, idx) => {
            const isSelected = idx === activeFileIndex;
            return (
              <button
                key={file.name}
                onClick={() => setActiveFileIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-emerald-400 border border-slate-700 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded transition-colors cursor-pointer"
          title="Copy file contents"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code / Content Viewer */}
      <div className="flex-1 overflow-auto bg-slate-950/90 p-4 font-mono text-xs leading-relaxed text-slate-300">
        <pre className="relative whitespace-pre font-mono">
          <code>
            {currentFile.content.split('\n').map((line, idx) => (
              <div key={idx} className="table-row hover:bg-slate-900/50 -mx-4 px-4 py-0.5">
                <span className="table-cell pr-4 text-right select-none text-slate-600 font-mono text-[11px] w-8">
                  {idx + 1}
                </span>
                <span className="table-cell">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Verification Metrics Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
          {role.metrics.map((metric, i) => (
            <div
              key={i}
              className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col"
            >
              <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                {metric.label}
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs font-bold text-slate-100">
                  {metric.value}
                </span>
                <CheckCircle className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
