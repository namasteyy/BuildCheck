'use client';

import React, { useState } from 'react';
import { Briefcase, Code2, GraduationCap } from 'lucide-react';
import { TopNav } from '@/components/enterprise/TopNav';
import { OverviewDashboard } from '@/components/enterprise/OverviewDashboard';
import { TaskScoperStudio } from '@/components/enterprise/TaskScoperStudio';
import { VectorRadarView } from '@/components/enterprise/VectorRadarView';
import { SandboxIDEView } from '@/components/enterprise/SandboxIDEView';
import { EscrowSettlementView } from '@/components/enterprise/EscrowSettlementView';
import { CandidatePortalView } from '@/components/candidate/CandidatePortalView';
import { LandingPage } from '@/components/marketing/LandingPage';
import { AccessGatewayModal } from '@/components/auth/AccessGatewayModal';
import { ToastProvider } from '@/components/common/Toast';
import { StudentDrivesView } from '@/components/placement/StudentDrivesView';
import { TPOAdminView } from '@/components/placement/TPOAdminView';
import { CompanyDrivesView } from '@/components/enterprise/CompanyDrivesView';
import { CANDIDATE_PROFILES, PIPELINE_METRICS } from '@/data/mockData';
import {
  INITIAL_TPO_STATS,
  INITIAL_STUDENTS,
  INITIAL_COMPANIES,
  INITIAL_DRIVES,
  INITIAL_APPLICATIONS,
} from '@/data/placementData';
import {
  CandidateProfile,
  EnterpriseTab,
  PortalMode,
  ScopedTask,
  AIPromptLog,
  AIEvaluationResult,
  OfferPackage,
  EscrowRecord,
  StudentPlacementProfile,
  CompanyPlacementProfile,
  PlacementDrive,
  PlacementApplication,
  TPOPlacementStats,
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
**Candidate:** Kabir Mehra (@kabir-dev)
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
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'enterprise' | 'candidate' | 'tpo_admin'>('landing');
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [gatewayTargetRole, setGatewayTargetRole] = useState<'recruiter' | 'candidate' | 'tpo_admin'>('recruiter');
  const [candidateSubView, setCandidateSubView] = useState<'drives' | 'sandbox'>('drives');

  // Unified Placement & Work Trial Data State
  const [students, setStudents] = useState<StudentPlacementProfile[]>(INITIAL_STUDENTS);
  const [activeStudent, setActiveStudent] = useState<StudentPlacementProfile>(INITIAL_STUDENTS[0]);
  const [drives, setDrives] = useState<PlacementDrive[]>(INITIAL_DRIVES);
  const [applications, setApplications] = useState<PlacementApplication[]>(INITIAL_APPLICATIONS);
  const [companies, setCompanies] = useState<CompanyPlacementProfile[]>(INITIAL_COMPANIES);
  const [tpoStats, setTpoStats] = useState<TPOPlacementStats>(INITIAL_TPO_STATS);

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
  const [escrowBalance, setEscrowBalance] = useState<number>(180000);
  // Financial & legal state — typed records replacing the old boolean
  const [escrowRecord, setEscrowRecord] = useState<EscrowRecord>({
    escrowId: `ESC-KM1-PENDING`,
    provider: 'razorpayx_escrow',
    status: 'pending',
    confirmedAmount: CANDIDATE_PROFILES[0].bounty,
    transactionId: null,
    releasedAt: null,
    documentHash: null,
  });

  const [offerPackage, setOfferPackage] = useState<OfferPackage>(() => ({
    position: CANDIDATE_PROFILES[0].role,
    hourlyRate: '₹50,000 / month (Internship Stipend)',
    annualBase: '₹16,00,000 CTC (PPO Track)',
    trialBounty: CANDIDATE_PROFILES[0].bounty,
    startDate: 'Immediate / Next Cohort',
    offerRef: `VF-OFFER-2026-${CANDIDATE_PROFILES[0].id.toUpperCase()}`,
    issuedAt: null,
  }));

  const [escrowAuditLog, setEscrowAuditLog] = useState<
    { timestamp: string; type: 'info' | 'action' | 'success' | 'warn'; message: string }[]
  >([
    {
      timestamp: '22:42:01',
      type: 'info',
      message: `Escrow vault created for ${CANDIDATE_PROFILES[0].name} — ₹${CANDIDATE_PROFILES[0].bounty.toLocaleString('en-IN')}.00 INR locked.`,
    },
    {
      timestamp: '22:42:02',
      type: 'success',
      message: `Deliverable verified: ${CANDIDATE_PROFILES[0].testPassRate} automated test gates passed.`,
    },
  ]);

  // Derived: for components that still check a simple boolean
  const escrowDisbursed = escrowRecord.status === 'released';

  const [terminalLogs, setTerminalLogs] = useState<
    { timestamp: string; type: 'info' | 'success' | 'warn' | 'vector'; message: string }[]
  >([
    {
      timestamp: '22:42:01.104',
      type: 'info',
      message: 'BuildCheck Sandbox Worker container online (session: bc-worker-891).',
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
          `Engineering Verification Evaluator: ${evalData.hiring_recommendation} (EVS: ${evalData.evs_total_score}/100)`
        );
        addLog(
          'success',
          'Fast-Track Offer Extended • ₹3,000 Paid Trial Stipend Disbursed to Candidate.'
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
    addLog('info', `Published Scoped Task: ${task.title} (₹${task.bounty.toLocaleString('en-IN')} INR escrow allocated via RazorpayX)`);
    const time = new Date().toTimeString().split(' ')[0];
    handleAddAuditEntry({
      timestamp: time,
      type: 'info',
      message: `New backlog challenge published: "${task.title}" with ₹${task.bounty.toLocaleString('en-IN')}.00 INR escrow guarantee.`,
    });
  };

  const handleTopUpEscrow = (amount: number) => {
    setEscrowBalance((prev) => prev + amount);
    const time = new Date().toTimeString().split(' ')[0];
    handleAddAuditEntry({
      timestamp: time,
      type: 'success',
      message: `Corporate escrow account topped up: +₹${amount.toLocaleString('en-IN')}.00 INR via RazorpayX NetBanking.`,
    });
    addLog('vector', `Escrow Vault +₹${amount.toLocaleString('en-IN')}.00 INR pre-funded via RazorpayX.`);
  };

  const handleDispatchCandidate = (cand: CandidateProfile) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === cand.id ? { ...c, status: 'invited' } : c))
    );
    const time = new Date().toTimeString().split(' ')[0];
    handleAddAuditEntry({
      timestamp: time,
      type: 'action',
      message: `Invited ${cand.name} (${cand.handle}) to 90-min trial: ${cand.taskName} (₹${cand.bounty.toLocaleString('en-IN')}.00 locked).`,
    });
    addLog('info', `Dispatched 90-Min Work Trial to ${cand.name} (₹${cand.bounty.toLocaleString('en-IN')} INR Escrow Allocated)`);
  };

  const handleArchiveCandidate = (candId: string, reason: string, notes: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, status: 'accepted' } : c))
    );
    addLog('warn', `Candidate ${candId} archived with feedback: ${reason}`);
  };

  const handleSelectCandidate = (cand: CandidateProfile) => {
    setSelectedCandidate(cand);
    setOfferPackage({
      position: cand.role,
      hourlyRate: '₹50,000 / month (Internship Stipend)',
      annualBase: '₹16,00,000 CTC (PPO Track)',
      trialBounty: cand.bounty,
      startDate: 'Immediate / Next Cohort',
      offerRef: `VF-OFFER-2026-${cand.id.toUpperCase()}`,
      issuedAt: cand.status === 'offer_extended' ? '2026-10-18T00:00:00Z' : null,
    });
    setEscrowRecord({
      escrowId: `ESC-${cand.id.toUpperCase()}-${cand.status === 'offer_extended' ? 'RELEASED' : 'PENDING'}`,
      provider: 'razorpayx_escrow',
      status: cand.status === 'offer_extended' ? 'released' : 'pending',
      confirmedAmount: cand.bounty,
      transactionId: cand.status === 'offer_extended' ? `txn_rzpx_${cand.id}_891` : null,
      releasedAt: cand.status === 'offer_extended' ? '2026-10-18T00:00:00Z' : null,
      documentHash: cand.status === 'offer_extended' ? 'sha256_8x92fa1b3...' : null,
    });
  };

  const handleDisburseComplete = (updatedRecord: EscrowRecord) => {
    setEscrowRecord(updatedRecord);
    setEscrowBalance((prev) => Math.max(0, prev - (updatedRecord.confirmedAmount || 3000)));
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === selectedCandidate.id ? { ...c, status: 'offer_extended' } : c
      )
    );
    addLog(
      'vector',
      `Escrow ${updatedRecord.escrowId} released ₹${(updatedRecord.confirmedAmount || 3000).toLocaleString('en-IN')}.00 INR via RazorpayX. Txn: ${updatedRecord.transactionId}`
    );
    addLog('success', 'Official Fast-Track Offer extended and DocuSign packet dispatched.');
  };

  const handleAddAuditEntry = (entry: {
    timestamp: string;
    type: 'info' | 'action' | 'success' | 'warn';
    message: string;
  }) => {
    setEscrowAuditLog((prev) => [...prev, entry]);
  };

  const handlePortalModeChange = (mode: PortalMode) => {
    setPortalMode(mode);
    if (mode === 'candidate') {
      setCurrentScreen('candidate');
    } else if (mode === 'tpo_admin') {
      setCurrentScreen('tpo_admin');
    } else {
      setCurrentScreen('enterprise');
    }
  };

  const handleTPOApproveDrive = (driveId: string) => {
    setDrives((prev) =>
      prev.map((d) => (d.id === driveId ? { ...d, status: 'Approved' } : d))
    );
    setTpoStats((prev) => ({
      ...prev,
      activeDrives: prev.activeDrives + 1,
    }));
    addLog('info', `TPO Admin: Approved campus placement drive ${driveId}`);
  };

  const handleTPORejectDrive = (driveId: string) => {
    setDrives((prev) => prev.filter((d) => d.id !== driveId));
    addLog('warn', `TPO Admin: Rejected campus placement drive ${driveId}`);
  };

  const handleTPOApproveCompany = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, status: 'Approved' } : c))
    );
    setTpoStats((prev) => ({
      ...prev,
      totalCompanies: prev.totalCompanies + 1,
    }));
    addLog('info', `TPO Admin: Verified company accreditation for ${companyId}`);
  };

  const handleApplyAndLaunchTrial = (drive: PlacementDrive) => {
    const existing = applications.find(
      (a) => a.driveId === drive.id && a.studentId === activeStudent.id
    );

    if (!existing) {
      const newApp: PlacementApplication = {
        id: `app-${Date.now()}`,
        driveId: drive.id,
        companyName: drive.companyName,
        driveTitle: drive.title,
        roleTitle: drive.roleTitle,
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        studentRollNo: activeStudent.rollNo,
        studentDepartment: activeStudent.department,
        studentCgpa: activeStudent.cgpa,
        dateApplied: '2026-10-18',
        status: 'Trial In Progress',
        evsScore: 96,
        testPassRate: '3 / 3 Gates Passed',
        stipendDisbursed: false,
      };
      setApplications((prev) => [newApp, ...prev]);
      setDrives((prev) =>
        prev.map((d) =>
          d.id === drive.id ? { ...d, applicantsCount: d.applicantsCount + 1 } : d
        )
      );
    } else {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === existing.id ? { ...a, status: 'Trial In Progress' } : a
        )
      );
    }

    setCandidateSubView('sandbox');
    addLog('info', `Enrolled in ${drive.companyName} Placement Drive: ${drive.title}`);
    addLog('vector', `Attached Challenge: ${drive.associatedChallengeTitle} • ₹${drive.trialStipend.toLocaleString('en-IN')} Escrow active.`);
  };

  const handleOpenExistingTrial = (challengeKey: 'reconcile' | 'rate_limiter' | 'janitor') => {
    setCandidateSubView('sandbox');
  };

  // 1. Marketing Landing Page View (Default)
  if (currentScreen === 'landing') {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <LandingPage
            onOpenGateway={(targetRole) => {
              setGatewayTargetRole(targetRole || 'recruiter');
              setIsGatewayOpen(true);
            }}
            onDirectEnter={(role) => {
              if (role === 'tpo_admin') {
                setCurrentScreen('tpo_admin');
                setPortalMode('tpo_admin');
              } else if (role === 'candidate') {
                setCurrentScreen('candidate');
                setPortalMode('candidate');
                setCandidateSubView('drives');
              } else {
                setCurrentScreen('enterprise');
                setPortalMode('enterprise');
              }
            }}
          />

          <AccessGatewayModal
            isOpen={isGatewayOpen}
            initialRole={gatewayTargetRole}
            onClose={() => setIsGatewayOpen(false)}
            onSelectRole={(role, candidateId, orgName) => {
              setIsGatewayOpen(false);
              if (role === 'tpo_admin') {
                setCurrentScreen('tpo_admin');
                setPortalMode('tpo_admin');
              } else if (role === 'candidate') {
                setCurrentScreen('candidate');
                setPortalMode('candidate');
                setCandidateSubView('drives');
                const targetId = candidateId || 'cand-1';
                const found = candidates.find((c) => c.id === targetId);
                if (found) {
                  handleSelectCandidate(found);
                }
              } else {
                setCurrentScreen('enterprise');
                setPortalMode('enterprise');
              }
            }}
          />
        </div>
      </ToastProvider>
    );
  }

  // 2. Candidate Portal View (Placement Drives & Work Trials)
  if (currentScreen === 'candidate') {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <TopNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            portalMode="candidate"
            onPortalModeChange={handlePortalModeChange}
            escrowTotal={escrowBalance}
            onTopUpEscrow={handleTopUpEscrow}
            onReturnHome={() => setCurrentScreen('landing')}
          />

          {/* Sub Navigation Bar for Students */}
          <div className="bg-slate-900/80 border-b border-slate-800 px-4 sm:px-6 py-2.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCandidateSubView('drives')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    candidateSubView === 'drives'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Campus Placement Drives</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 font-bold">
                    {drives.filter((d) => d.status === 'Approved').length}
                  </span>
                </button>

                <button
                  onClick={() => setCandidateSubView('sandbox')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    candidateSubView === 'sandbox'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Active Work Trial (IDE)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    90m Piston
                  </span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  <span>{activeStudent.name} ({activeStudent.rollNo})</span>
                </span>
                <span>&bull;</span>
                <span className="font-mono text-emerald-400">CGPA: {activeStudent.cgpa}</span>
              </div>
            </div>
          </div>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {candidateSubView === 'drives' ? (
              <StudentDrivesView
                student={activeStudent}
                drives={drives}
                applications={applications}
                onApplyAndLaunchTrial={handleApplyAndLaunchTrial}
                onOpenExistingTrial={handleOpenExistingTrial}
              />
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setCandidateSubView('drives')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>&larr; Back to Campus Drives</span>
                  </button>
                  <div className="text-xs text-slate-400 font-mono">
                    Challenge: <span className="text-emerald-400 font-semibold">Payment Reconciliation Logic</span>
                  </div>
                </div>

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
                    setCurrentScreen('enterprise');
                    setPortalMode('enterprise');
                    setActiveTab('sandbox');
                  }}
                  onReturnHome={() => setCurrentScreen('landing')}
                />
              </div>
            )}
          </main>

          <footer className="border-t border-slate-900 py-5 px-6 bg-slate-950 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-300">BuildCheck Candidate Portal</span>
                <span>&bull;</span>
                <span>IIIT Delhi Campus Placement Cell</span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-mono">₹3,000 RazorpayX Escrow Guaranteed</span>
              </div>

              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span>Python 3.10 Piston</span>
                <span>Monaco VS-Dark</span>
              </div>
            </div>
          </footer>
        </div>
      </ToastProvider>
    );
  }

  // 3. Institute TPO Admin View (IIIT Delhi Training & Placement Office)
  if (currentScreen === 'tpo_admin') {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <TopNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            portalMode="tpo_admin"
            onPortalModeChange={handlePortalModeChange}
            escrowTotal={escrowBalance}
            onTopUpEscrow={handleTopUpEscrow}
            onReturnHome={() => setCurrentScreen('landing')}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <TPOAdminView
              stats={tpoStats}
              drives={drives}
              students={students}
              companies={companies}
              onApproveDrive={handleTPOApproveDrive}
              onRejectDrive={handleTPORejectDrive}
              onApproveCompany={handleTPOApproveCompany}
            />
          </main>

          <footer className="border-t border-slate-900 py-5 px-6 bg-slate-950 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-300">IIIT Delhi</span>
                <span>&bull;</span>
                <span>Training &amp; Placement Cell Console</span>
                <span>&bull;</span>
                <span className="text-blue-400 font-semibold">BuildCheck Work Trial Integration</span>
              </div>

              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span>Batch 2026</span>
                <span>Tier-1 Placement Protocol</span>
              </div>
            </div>
          </footer>
        </div>
      </ToastProvider>
    );
  }

  // 4. Recruiter Enterprise Portal View (currentScreen === 'enterprise')
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <TopNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          portalMode="enterprise"
          onPortalModeChange={handlePortalModeChange}
          escrowTotal={escrowBalance}
          onTopUpEscrow={handleTopUpEscrow}
          onReturnHome={() => setCurrentScreen('landing')}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <div>
            {activeTab === 'overview' && (
              <OverviewDashboard
                metrics={PIPELINE_METRICS}
                candidates={candidates}
                onNavigateTab={setActiveTab}
                onSelectCandidate={handleSelectCandidate}
              />
            )}

            {activeTab === 'drives' && (
              <CompanyDrivesView
                drives={drives}
                applications={applications}
                onNavigateTab={setActiveTab}
                onSelectCandidateForReview={(app) => {
                  const matched =
                    candidates.find((c) =>
                      c.name.toLowerCase().includes(app.studentName.toLowerCase())
                    ) || candidates[0];
                  setSelectedCandidate(matched);
                  setActiveTab('sandbox');
                }}
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
                onSelectCandidate={handleSelectCandidate}
                onNavigateTab={setActiveTab}
                onDispatchCandidate={handleDispatchCandidate}
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
                offerPackage={offerPackage}
                escrowRecord={escrowRecord}
                onDisburseComplete={handleDisburseComplete}
                auditLog={escrowAuditLog}
                onAddAuditEntry={handleAddAuditEntry}
                onArchiveCandidate={handleArchiveCandidate}
              />
            )}
          </div>
        </main>

        <footer className="border-t border-slate-900 py-5 px-6 bg-slate-950 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-300">BuildCheck</span>
              <span>&bull;</span>
              <span>Intern &amp; Junior Engineering Console</span>
              <span>&bull;</span>
              <span className="text-slate-400">RazorpayX Corporate Escrow</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>pgvector 0.7.0</span>
              <span>Deterministic EVS</span>
              <span>Python 3.10 Sandbox</span>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
