'use client';

import React, { useState } from 'react';
import { TopNav } from '@/components/enterprise/TopNav';
import { OverviewDashboard } from '@/components/enterprise/OverviewDashboard';
import { TaskScoperStudio } from '@/components/enterprise/TaskScoperStudio';
import { VectorRadarView } from '@/components/enterprise/VectorRadarView';
import { SandboxIDEView } from '@/components/enterprise/SandboxIDEView';
import { EscrowSettlementView } from '@/components/enterprise/EscrowSettlementView';
import { CandidatePortalView } from '@/components/candidate/CandidatePortalView';
import { CANDIDATE_PROFILES, PIPELINE_METRICS } from '@/data/mockData';
import { CandidateProfile, EnterpriseTab, PortalMode, ScopedTask } from '@/types';

const INITIAL_CODE = `def reconcile_invoices(invoices, payments):
    # TODO: Match invoice IDs where payment amount equals invoice amount
    matched_ids = []
    for inv in invoices:
        for pay in payments:
            if inv['id'] == pay['id'] and inv['amt'] == pay['paid']:
                matched_ids.append(inv['id'])
    return matched_ids
`;

export default function Home() {
  const [portalMode, setPortalMode] = useState<PortalMode>('enterprise');
  const [activeTab, setActiveTab] = useState<EnterpriseTab>('overview');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile>(CANDIDATE_PROFILES[0]);
  const [candidates, setCandidates] = useState<CandidateProfile[]>(CANDIDATE_PROFILES);

  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testPassed, setTestPassed] = useState<boolean>(true);
  const [evsScore, setEvsScore] = useState<number>(96);
  const [escrowDisbursed, setEscrowDisbursed] = useState<boolean>(false);

  const [terminalLogs, setTerminalLogs] = useState<
    { timestamp: string; type: 'info' | 'success' | 'warn' | 'vector'; message: string }[]
  >([
    {
      timestamp: '22:42:01.104',
      type: 'info',
      message: 'VentureForge Sandbox Worker container online (session: vf-worker-891).',
    },
    {
      timestamp: '22:42:01.250',
      type: 'vector',
      message: 'pgvector query: 1,536-dim embedding match = 0.9412 (Distance: 0.0588).',
    },
    {
      timestamp: '22:42:02.890',
      type: 'success',
      message: 'PASSED: All payment reconciliation unit tests passed successfully!',
    },
  ]);

  const addLog = (type: 'info' | 'success' | 'warn' | 'vector', message: string) => {
    const time =
      new Date().toTimeString().split(' ')[0] +
      '.' +
      Math.floor(Math.random() * 900 + 100);
    setTerminalLogs((prev) => [...prev, { timestamp: time, type, message }]);
  };

  const handleRunTest = async () => {
    setIsRunningTest(true);
    addLog('info', 'POST /api/run [role=swe] dispatching to Piston Sandbox...');

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'swe',
          content: code,
        }),
      });

      const data = await res.json();

      if (data.output) {
        const lines: string[] = data.output.split('\n');
        for (const line of lines) {
          if (line.trim()) {
            const isPassed =
              line.includes('PASSED') ||
              line.includes('VALID') ||
              line.includes('Verified');
            const isFailed = line.includes('FAILED') || line.includes('Error');
            addLog(isPassed ? 'success' : isFailed ? 'warn' : 'info', line);
          }
        }
      }

      setTestPassed(data.passed);
      setEvsScore(data.evsScore || 96);

      if (data.passed) {
        addLog(
          'vector',
          `pgvector: Autonomous Verification Gate Passed! EVS Score: ${data.evsScore}/100.`
        );
        addLog(
          'success',
          'Fast-Track Offer Extended • $150 Paid Trial Bounty Disbursed to Candidate.'
        );
      } else {
        addLog(
          'warn',
          `Verification Gate: Failed assertions detected. EVS Score: ${data.evsScore}/100.`
        );
      }
    } catch (e: any) {
      addLog('warn', `Sandbox Execution Error: ${e.message}`);
    } finally {
      setIsRunningTest(false);
    }
  };

  const handlePublishTask = (task: ScopedTask) => {
    addLog('info', `Published Scoped Task: ${task.title} ($${task.bounty} USDC escrow allocated)`);
  };

  const handleDisburseEscrow = () => {
    setEscrowDisbursed(true);
    addLog('vector', 'Smart contract escrow #ESC-9812 released $150.00 USDC to Leo M. (@leom-dev)');
    addLog('success', 'Fast-Track Official Offer extended and signed.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Global Navigation Bar */}
      <TopNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        portalMode={portalMode}
        onPortalModeChange={setPortalMode}
        escrowTotal={escrowDisbursed ? 1050 : 1200}
      />

      {/* 2. Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {portalMode === 'enterprise' ? (
          /* Enterprise Portal Experience */
          <div>
            {activeTab === 'overview' && (
              <OverviewDashboard
                metrics={PIPELINE_METRICS}
                candidates={candidates}
                onNavigateTab={setActiveTab}
                onSelectCandidate={setSelectedCandidate}
              />
            )}

            {activeTab === 'scoper' && (
              <TaskScoperStudio
                onPublishTask={handlePublishTask}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'radar' && (
              <VectorRadarView
                candidates={candidates}
                onSelectCandidate={setSelectedCandidate}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'sandbox' && (
              <SandboxIDEView
                candidate={selectedCandidate}
                code={code}
                onCodeChange={setCode}
                isRunningTest={isRunningTest}
                onRunTest={handleRunTest}
                logs={terminalLogs}
                testPassed={testPassed}
                evsScore={evsScore}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'escrow' && (
              <EscrowSettlementView
                candidate={selectedCandidate}
                escrowDisbursed={escrowDisbursed}
                onDisburseEscrow={handleDisburseEscrow}
              />
            )}
          </div>
        ) : (
          /* Candidate Portal Experience */
          <CandidatePortalView
            candidate={selectedCandidate}
            code={code}
            onCodeChange={setCode}
            isRunningTest={isRunningTest}
            onRunTest={handleRunTest}
            logs={terminalLogs}
            testPassed={testPassed}
            evsScore={evsScore}
            escrowDisbursed={escrowDisbursed}
            onSwitchToEnterprise={() => {
              setPortalMode('enterprise');
              setActiveTab('overview');
            }}
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <footer className="border-t border-slate-900 py-6 px-6 bg-slate-950/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">VentureForge Enterprise</span>
            <span>&bull;</span>
            <span>Autonomous Work-to-Match Protocol</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-mono">Mainnet Escrow v2.4</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>pgvector 0.7.0</span>
            <span>Piston Sandbox</span>
            <span>Deterministic EVS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
