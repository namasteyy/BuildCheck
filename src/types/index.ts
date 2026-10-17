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
