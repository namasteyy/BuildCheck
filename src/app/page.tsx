'use client';

import React, { useState } from 'react';
import { EnterpriseHeader } from '@/components/EnterpriseHeader';
import { WorkspacePanel } from '@/components/WorkspacePanel';
import { TerminalTelemetryPanel, ExecutionResult } from '@/components/TerminalTelemetryPanel';
import { ROLES_DATA } from '@/data/rolesData';
import { RoleType } from '@/types';

export default function Home() {
  const [activeRole, setActiveRole] = useState<RoleType>('swe');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>({
    output: 'PASSED: All payment reconciliation unit tests passed successfully!',
    passed: true,
    evsScore: 96,
  });
  const [customLogs, setCustomLogs] = useState<{ timestamp: string; type: 'info' | 'success' | 'warn' | 'vector'; message: string }[]>([
    {
      timestamp: '22:30:10.104',
      type: 'info',
      message: 'Sandbox container runner online (session: vf-pod-891).',
    },
    {
      timestamp: '22:30:11.250',
      type: 'vector',
      message: 'pgvector embedding index: HNSW cosine distance = 0.0588.',
    },
    {
      timestamp: '22:30:12.890',
      type: 'success',
      message: 'PASSED: All payment reconciliation unit tests passed successfully!',
    },
  ]);

  const currentRole = ROLES_DATA[activeRole];

  const handleRoleChange = (role: RoleType) => {
    setActiveRole(role);
    setExecutionResult(null);
    const time = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);
    setCustomLogs([
      {
        timestamp: time,
        type: 'vector',
        message: `Context switched to ${ROLES_DATA[role].title}. Loaded workspace [${ROLES_DATA[role].sprintName}].`,
      },
    ]);
  };

  const handleAddLog = (type: 'info' | 'success' | 'warn' | 'vector', message: string) => {
    const time = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);
    setCustomLogs((prev) => [...prev, { timestamp: time, type, message }]);
  };

  const handleRunVerification = async (code: string) => {
    setIsRunningTest(true);
    handleAddLog('info', `POST /api/run [role=${activeRole}] dispatching to sandbox container...`);

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: activeRole,
          content: code,
        }),
      });

      const data: ExecutionResult = await res.json();
      setExecutionResult(data);

      if (data.output) {
        const lines: string[] = data.output.split('\n');
        for (const line of lines) {
          if (line.trim()) {
            const isPassed = line.includes('PASSED') || line.includes('VALID') || line.includes('Verified');
            const isFailed = line.includes('FAILED') || line.includes('Error');
            handleAddLog(
              isPassed ? 'success' : isFailed ? 'warn' : 'info',
              line
            );
          }
        }
      }

      if (data.passed) {
        handleAddLog('vector', `pgvector: Autonomous Verification Gate Passed! EVS Score: ${data.evsScore}/100.`);
        handleAddLog('success', 'Fast-Track Offer Extended • $150 Paid Trial Bounty Disbursed to Candidate.');
      } else {
        handleAddLog('warn', `Verification Gate: Failed assertions detected. EVS Score: ${data.evsScore}/100.`);
      }
    } catch (e: any) {
      handleAddLog('warn', `API Error: ${e.message}`);
    } finally {
      setIsRunningTest(false);
    }
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
          {/* Left Column: Dynamic Workspace Panel with Monaco Editor */}
          <WorkspacePanel
            role={currentRole}
            activeRole={activeRole}
            onRunTest={handleRunVerification}
            isRunningTest={isRunningTest}
          />

          {/* Right Column: Terminal & Offer Panel */}
          <TerminalTelemetryPanel
            role={currentRole}
            isRunningTest={isRunningTest}
            logs={customLogs}
            executionResult={executionResult}
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
