'use client';

import React, { useState } from 'react';
import { EnterpriseHeader } from '@/components/EnterpriseHeader';
import { WorkspacePanel } from '@/components/WorkspacePanel';
import { TerminalTelemetryPanel } from '@/components/TerminalTelemetryPanel';
import { ROLES_DATA } from '@/data/rolesData';
import { RoleType } from '@/types';

export default function Home() {
  const [activeRole, setActiveRole] = useState<RoleType>('swe');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [customLogs, setCustomLogs] = useState<{ timestamp: string; type: 'info' | 'success' | 'warn' | 'vector'; message: string }[]>([]);

  const currentRole = ROLES_DATA[activeRole];

  const handleRoleChange = (role: RoleType) => {
    setActiveRole(role);
    const time = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);
    setCustomLogs((prev) => [
      ...prev,
      {
        timestamp: time,
        type: 'vector',
        message: `Switched context to ${ROLES_DATA[role].title}. Loaded candidate work sample [${ROLES_DATA[role].sprintName}].`,
      },
    ]);
  };

  const handleAddLog = (type: 'info' | 'success' | 'warn' | 'vector', message: string) => {
    const time = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);
    setCustomLogs((prev) => [...prev, { timestamp: time, type, message }]);
  };

  const handleRunVerification = () => {
    setIsRunningTest(true);
    const time = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);
    handleAddLog('info', `Triggered automated verification test suite for ${currentRole.title}...`);

    setTimeout(() => {
      handleAddLog('success', `[VERIFY] Sandbox isolation verified. Testing edge cases & concurrency limits.`);
    }, 700);

    setTimeout(() => {
      handleAddLog('vector', `[pgvector] Cosine distance updated: ${currentRole.vectorDistance.toFixed(4)}. Confidence: High.`);
      handleAddLog('success', `[PASS] All verification gates passed (score: ${currentRole.matchScore}%).`);
      setIsRunningTest(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Enterprise Header Component */}
      <EnterpriseHeader
        activeRole={activeRole}
        onSelectRole={handleRoleChange}
        matchScore={currentRole.matchScore}
        candidateName={currentRole.candidateName}
        candidateEducation={currentRole.candidateEducation}
      />

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {/* Role Quick Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100 tracking-tight">
                {currentRole.title}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                Autonomous Sprint Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentRole.description}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {currentRole.skills.map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Two-Column Grid Layout (height ~620px) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Left Column: Workspace Panel */}
          <WorkspacePanel
            role={currentRole}
            onRunTest={handleRunVerification}
            isRunningTest={isRunningTest}
          />

          {/* Right Column: Terminal & Telemetry Panel */}
          <TerminalTelemetryPanel
            role={currentRole}
            customLogs={customLogs}
            onAddLog={handleAddLog}
            isRunningTest={isRunningTest}
          />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-900 py-3 px-6 bg-slate-950/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <p>VentureForge Enterprise Protocol • Autonomous Work-to-Match Evaluation System</p>
        <p className="font-mono text-[11px] text-slate-600 mt-1 sm:mt-0">pgvector v0.7.0 • HNSW Cosine Index</p>
      </footer>
    </div>
  );
}
