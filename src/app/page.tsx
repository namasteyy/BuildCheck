'use client';

import React, { useState } from 'react';
import { GlobalNavbar } from '@/components/GlobalNavbar';
import { RecruiterJourney } from '@/components/RecruiterJourney';
import { CandidateJourney } from '@/components/CandidateJourney';
import { PersonaView } from '@/types';

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
  const [personaView, setPersonaView] = useState<PersonaView>('recruiter');
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testPassed, setTestPassed] = useState<boolean>(true);
  const [evsScore, setEvsScore] = useState<number>(96);
  const [escrowDisbursed, setEscrowDisbursed] = useState<boolean>(false);
  const [ndaAccepted, setNdaAccepted] = useState<boolean>(true);
  const [taskClaimed, setTaskClaimed] = useState<boolean>(true);

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

  const addLog = (
    type: 'info' | 'success' | 'warn' | 'vector',
    message: string
  ) => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans p-3 sm:p-6 space-y-6">
      <div className="max-w-7xl w-full mx-auto space-y-6 flex-1 flex flex-col">
        {/* 1. Global Navigation & Persona Switcher */}
        <GlobalNavbar
          view={personaView}
          onViewChange={setPersonaView}
          escrowDisbursed={escrowDisbursed}
        />

        {/* 2. Main Persona Workspace */}
        <main className="flex-1 flex flex-col">
          {personaView === 'recruiter' ? (
            /* PERSONA 1: Recruiter User Journey */
            <RecruiterJourney
              onSwitchToCandidate={() => setPersonaView('candidate')}
              escrowDisbursed={escrowDisbursed}
              onDisburseEscrow={() => setEscrowDisbursed(true)}
            />
          ) : (
            /* PERSONA 2: Candidate User Journey */
            <CandidateJourney
              code={code}
              onCodeChange={setCode}
              isRunningTest={isRunningTest}
              onRunTest={handleRunTest}
              logs={terminalLogs}
              testPassed={testPassed}
              evsScore={evsScore}
              escrowDisbursed={escrowDisbursed}
              ndaAccepted={ndaAccepted}
              onNdaChange={setNdaAccepted}
              taskClaimed={taskClaimed}
              onClaimTask={() => setTaskClaimed(true)}
              onSwitchToRecruiter={() => setPersonaView('recruiter')}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 pt-4 pb-2 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between">
          <p>
            VentureForge Enterprise Protocol &bull; Dual-Sided Autonomous Work-to-Match System
          </p>
          <p className="font-mono text-[11px] text-slate-600 mt-1 sm:mt-0">
            pgvector v0.7.0 &bull; Piston Sandbox &bull; Smart Contract Escrow
          </p>
        </footer>
      </div>
    </div>
  );
}
