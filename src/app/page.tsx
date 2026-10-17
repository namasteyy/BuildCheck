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
        message: `Switched context to ${ROLES_DATA[role].title}. Loaded workspace [${ROLES_DATA[role].sprintName}].`,
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

    if (activeRole === 'swe') {
      handleAddLog('info', 'Executing: pytest test_invoices.py -v --tb=short');
      setTimeout(() => {
        handleAddLog('success', 'test_invoices.py::test_reconcile_exact_match PASSED [ 33%]');
        handleAddLog('success', 'test_invoices.py::test_reconcile_duplicate_payments PASSED [ 66%]');
        handleAddLog('success', 'test_invoices.py::test_reconcile_partial_unmatched PASSED [100%]');
      }, 700);
      setTimeout(() => {
        handleAddLog('vector', `pgvector: Python PyTest Suite Passed (Cosine Match: 0.${currentRole.matchScore}4).`);
        handleAddLog('success', 'Candidate submission validated: 3 passed in 0.14s.');
        setIsRunningTest(false);
      }, 1600);
    } else if (activeRole === 'pm') {
      handleAddLog('info', 'Executing: ventureforge-ai eval --rubric=prd-enterprise-v2 --input=feature_spec.md');
      setTimeout(() => {
        handleAddLog('success', 'AI Logic Rubric: User stories & acceptance criteria clarity score: 98/100.');
        handleAddLog('success', 'AI Logic Rubric: Edge-case boundary conditions mapped: 100%.');
      }, 700);
      setTimeout(() => {
        handleAddLog('vector', `pgvector: PRD Semantic embedding matched to Staff PM benchmark (Distance: 0.${currentRole.vectorDistance.toFixed(4).replace('0.', '')}).`);
        handleAddLog('success', 'AI Logic Rubric Complete: Work sample certified for Enterprise cohort.');
        setIsRunningTest(false);
      }, 1600);
    } else {
      handleAddLog('info', 'Executing: hadolint Dockerfile && trivy config deploy.yml');
      setTimeout(() => {
        handleAddLog('success', 'hadolint: 0 warnings, 0 errors. Multi-stage build layer cache verified.');
        handleAddLog('success', 'trivy: 0 critical vulnerabilities detected. GitHub Actions syntax valid.');
      }, 700);
      setTimeout(() => {
        handleAddLog('vector', `pgvector: CI/CD Pipeline & IaC verified (Match Score: ${currentRole.matchScore}%).`);
        handleAddLog('success', 'Container Linter & Build: Pipeline run simulated successfully.');
        setIsRunningTest(false);
      }, 1600);
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
