export type PersonaView = 'recruiter' | 'candidate';
export type PortalMode = 'enterprise' | 'candidate';
export type EnterpriseTab = 'overview' | 'scoper' | 'radar' | 'sandbox' | 'escrow';

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
