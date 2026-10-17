export type PersonaView = 'recruiter' | 'candidate' | 'tpo_admin';
export type PortalMode = 'enterprise' | 'candidate' | 'tpo_admin';
export type EnterpriseTab = 'overview' | 'drives' | 'scoper' | 'radar' | 'sandbox' | 'escrow';

export type RoleType = 'swe' | 'pm' | 'devops';

export interface RoleConfig {
  id: RoleType;
  title: string;
  shortTitle: string;
  badge: string;
  sprintName: string;
  matchScore: number;
  vectorDistance: number;
  candidateName: string;
  candidateEducation: string;
  description: string;
  skills: string[];
  metrics: {
    label: string;
    value: string;
    status: 'good' | 'optimal' | 'warning';
  }[];
  files: {
    name: string;
    language: string;
    content: string;
  }[];
  logs: {
    timestamp: string;
    type: 'info' | 'success' | 'warn' | 'vector';
    message: string;
  }[];
  vectorBreakdown: {
    dimension: string;
    score: number;
    benchmark: number;
  }[];
}

export interface CandidateProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  education: string;
  vectorMatch: number;
  cosineDistance: number;
  evsScore: number;
  skills: string[];
  status: 'invited' | 'in_progress' | 'verified' | 'offer_extended' | 'accepted';
  bounty: number;
  taskName: string;
  turnaroundTime: string;
  testPassRate: string;
}

export interface PipelineMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  subtext: string;
}

export interface ScopedTask {
  id: string;
  title: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  bounty: number;
  techStack: string[];
  description: string;
  requirements: string[];
  testCount: number;
  timeLimitHours: number;
}

export interface AIPromptLog {
  id: string;
  timestamp: string;
  sender: 'candidate' | 'assistant';
  message: string;
  containedCode?: boolean;
}

export interface AIEvaluationResult {
  functional_score: number; // Based on unit tests passed
  ai_efficiency_score: number; // Quality of prompts sent to the AI (clear constraints vs vague "fix this")
  human_refactoring_index: number; // Ratio of AI code accepted as-is vs manually edited/corrected
  security_and_quality_score: number; // Handling of edge cases, SQL/XSS sanitization, and clean structure
  evs_total_score: number; // Weighted composite score
  key_observations: string[];
  hiring_recommendation: 'FAST_TRACK_OFFER' | 'INTERVIEW_REQUIRED' | 'REJECT';
  keystroke_telemetry?: {
    time_spent_minutes: number;
    copy_paste_count: number;
    manual_edits_pct: number;
    ai_inserts_pct: number;
  };
}

// Financial & Legal types
export type DisburseState = 'idle' | 'confirming' | 'processing' | 'confirmed' | 'error';

export interface OfferPackage {
  position: string;
  hourlyRate: string;
  annualBase: string;
  trialBounty: number;
  startDate: string;
  offerRef: string;
  issuedAt: string | null; // null until disbursed
}

export interface EscrowRecord {
  escrowId: string;
  provider: 'razorpayx_escrow' | 'stripe_connect';
  status: 'pending' | 'released' | 'disputed';
  confirmedAmount: number;
  transactionId: string | null;  // null until released
  releasedAt: string | null;     // ISO timestamp
  documentHash: string | null;   // SHA-256 of offer doc, null until released
}

export interface AuditLogEntry {
  timestamp: string;
  type: 'info' | 'action' | 'success' | 'warn';
  actor: string;
  message: string;
}

// ── Unified Placement Portal Models (from Placement-Portal-Application---V2) ──
export interface StudentPlacementProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  rollNo: string;
  cgpa: number;
  department: string;
  degree: string;
  graduationYear: number;
  resumeLink: string;
  skills: string[];
  status: 'Active' | 'Placed' | 'In-Trial';
  placedCompany?: string;
  packageOffered?: string;
}

export interface CompanyPlacementProfile {
  id: string;
  name: string;
  industry: string;
  website: string;
  description: string;
  contactEmail: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  drivesCount: number;
}

export interface PlacementDrive {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  roleTitle: string;
  description: string;
  stipendOrPackage: string; // e.g. "₹45,000 / month" or "22 LPA"
  trialStipend: number;     // e.g. 3000
  criteriaCgpa: number;     // e.g. 7.5
  criteriaBranches: string[]; // e.g. ['CSE', 'ECE', 'IT', 'AI/DS']
  criteriaDegree: string;   // e.g. 'B.Tech'
  criteriaYear: number;     // e.g. 2026
  deadline: string;
  dateCreated: string;
  status: 'Approved' | 'Pending';
  challengeKey: 'reconcile' | 'rate_limiter' | 'janitor';
  associatedChallengeTitle: string;
  applicantsCount: number;
}

export interface PlacementApplication {
  id: string;
  driveId: string;
  companyName: string;
  driveTitle: string;
  roleTitle: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentDepartment: string;
  studentCgpa: number;
  dateApplied: string;
  status: 'Applied' | 'Trial In Progress' | 'Verified (100% Passed)' | 'Offer Extended' | 'Rejected';
  evsScore?: number;
  testPassRate?: string;
  stipendDisbursed?: boolean;
}

export interface TPOPlacementStats {
  totalStudents: number;
  placedStudents: number;
  placementRatePct: number;
  totalCompanies: number;
  activeDrives: number;
  highestPackage: string;
  averagePackage: string;
  totalStipendDisbursed: number;
}
