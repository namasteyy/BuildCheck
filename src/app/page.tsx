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
import {
  CandidateProfile,
  EnterpriseTab,
  PortalMode,
  ScopedTask,
  AIPromptLog,
  AIEvaluationResult,
} from '@/types';

// The refactored solution that handles zero-value payments and duplicate deduplication
const INITIAL_CODE = `def reconcile_invoices(invoices, payments):
    """
    Reconciles unverified payment transactions against invoice IDs.
    
    Refactored from baseline AI output:
    1. Guards against zero-value or negative payments (paid <= 0)
    2. Prevents duplicate payment matches for the same invoice ID
    3. Optimized to O(N) hashmap lookup
    """
    matched_ids = []
    seen = set()
    
    # Filter valid positive payments
    valid_payments = {p['id']: p['paid'] for p in payments if p.get('paid', 0) > 0}
    
    for inv in invoices:
        inv_id = inv.get('id')
        if inv_id not in seen and valid_payments.get(inv_id) == inv.get('amt'):
            matched_ids.append(inv_id)
            seen.add(inv_id)
            
    return matched_ids
`;

const INITIAL_NOTES = `# Candidate Architectural Decisions & AI Audit Notes
**Candidate:** Leo M. (@leom-dev)
**Task:** AI-Assisted Payment Reconciliation Endpoint

### AI Code Modifications & Refactoring Rationale
1. **Zero-Value Payment Exploit:** The initial AI assistant output accepted zero and negative payment amounts (amt == paid == 0). I added explicit guards (pay['paid'] > 0) to prevent unauthorized invoice closure.
2. **Duplicate Injection Vulnerability:** The baseline nested loop re-matched duplicate payments against the same invoice ID. I refactored the lookup to an O(n) hash set with deduplication.
3. **Time Complexity:** Replaced O(N*M) nested iteration with an indexed dictionary lookup, reducing P99 latency from 18ms to 1.1ms for 10k transactions.
`;

const INITIAL_PROMPT_LOGS: AIPromptLog[] = [
  {
    id: '1',
    timestamp: '22:31:04',
    sender: 'candidate',
    message: 'Generate starter code for /reconcile endpoint with basic matching.',
  },
  {
    id: '2',
    timestamp: '22:31:06',
    sender: 'assistant',
    message: `Here is starter code for reconcile_invoices. Note: Check edge-case validation and performance bounds before submitting.\n\n\`\`\`python\ndef reconcile_invoices(invoices, payments):\n    matched_ids = []\n    for inv in invoices:\n        for pay in payments:\n            if inv["id"] == pay["id"] and inv["amt"] == pay["paid"]:\n                matched_ids.append(inv["id"])\n    return matched_ids\n\`\`\``,
    containedCode: true,
  },
  {
    id: '3',
    timestamp: '22:33:18',
    sender: 'candidate',
    message: 'How should we handle zero-value payments and duplicate invoice injection attacks in O(N)?',
  },
  {
    id: '4',
    timestamp: '22:33:20',
    sender: 'assistant',
    message:
      'Audit analysis: Filter out zero payments where paid <= 0, and use a hash set of processed IDs to prevent duplicate matches in O(N).',
  },
];

const INITIAL_EVALUATION: AIEvaluationResult = {
  functional_score: 100,
  ai_efficiency_score: 95,
  human_refactoring_index: 92,
  security_and_quality_score: 96,
  evs_total_score: 96,
  key_observations: [
    'Strong prompt engineering: specified concrete constraints (O(n) complexity, edge cases) in AI queries.',
    'Caught AI hallucination regarding missing zero-value payment validation.',
    'Refactored vulnerable nested loop into atomic hash set with duplicate invoice prevention.',
    'Provided rigorous architectural rationale in NOTES.md.',
    'Turnaround time: 42 minutes (well within 90 min limit).',
  ],
  hiring_recommendation: 'FAST_TRACK_OFFER',
  keystroke_telemetry: {
    time_spent_minutes: 42,
    copy_paste_count: 2,
    manual_edits_pct: 68,
    ai_inserts_pct: 32,
  },
};

export default function Home() {
  const [portalMode, setPortalMode] = useState<PortalMode>('enterprise');
  const [activeTab, setActiveTab] = useState<EnterpriseTab>('overview');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile>(CANDIDATE_PROFILES[0]);
  const [candidates, setCandidates] = useState<CandidateProfile[]>(CANDIDATE_PROFILES);

  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [notesContent, setNotesContent] = useState<string>(INITIAL_NOTES);
  const [promptLogs, setPromptLogs] = useState<AIPromptLog[]>(INITIAL_PROMPT_LOGS);
  const [evaluation, setEvaluation] = useState<AIEvaluationResult>(INITIAL_EVALUATION);

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
    {
      timestamp: '22:42:03.010',
      type: 'success',
      message: '  ✓ Test 1: Standard exact match verified [PASS]',
    },
    {
      timestamp: '22:42:03.015',
      type: 'success',
      message: '  ✓ Test 2: Zero-value payment exploit rejected [PASS]',
    },
    {
      timestamp: '22:42:03.020',
      type: 'success',
      message: '  ✓ Test 3: Duplicate invoice ID deduplicated [PASS]',
    },
  ]);

  const addLog = (type: 'info' | 'success' | 'warn' | 'vector', message: string) => {
    const time =
      new Date().toTimeString().split(' ')[0] +
      '.' +
      Math.floor(Math.random() * 900 + 100);
    setTerminalLogs((prev) => [...prev, { timestamp: time, type, message }]);
  };

  const handleAddPromptLog = (
    sender: 'candidate' | 'assistant',
    message: string,
    containedCode = false
  ) => {
    const time = new Date().toTimeString().split(' ')[0];
    const newLog: AIPromptLog = {
      id: `${Date.now()}`,
      timestamp: time,
      sender,
      message,
      containedCode,
    };
    setPromptLogs((prev) => [...prev, newLog]);
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
              line.includes('Verified') ||
              line.includes('✓');
            const isFailed = line.includes('FAILED') || line.includes('Error');
            addLog(isPassed ? 'success' : isFailed ? 'warn' : 'info', line);
          }
        }
      }

      setTestPassed(data.passed);
      setEvsScore(data.evsScore || 96);

      // Trigger Senior Staff AI Evaluator Engine
      const evalRes = await fetch('/api/eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitted_code: code,
          ai_prompt_logs: promptLogs,
          test_results: data.output || '',
          notes_content: notesContent,
          keystroke_telemetry: {
            time_spent_minutes: 42,
            copy_paste_count: 2,
            manual_edits_pct: 68,
            ai_inserts_pct: 32,
          },
        }),
      });

      const evalData: AIEvaluationResult = await evalRes.json();
      setEvaluation(evalData);

      if (data.passed) {
        addLog(
          'vector',
          `Senior Staff AI Evaluator: ${evalData.hiring_recommendation} (EVS: ${evalData.evs_total_score}/100)`
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
                notesContent={notesContent}
                onNotesChange={setNotesContent}
                promptLogs={promptLogs}
                evaluation={evaluation}
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
            notesContent={notesContent}
            onNotesChange={setNotesContent}
            promptLogs={promptLogs}
            onAddPromptLog={handleAddPromptLog}
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
            <span>AI Evaluator Engine</span>
            <span>Deterministic EVS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
