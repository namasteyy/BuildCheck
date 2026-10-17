export type PersonaView = 'recruiter' | 'candidate';

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

export interface SharedAppState {
  code: string;
  testPassed: boolean;
  evsScore: number;
  testOutput: string;
  escrowDisbursed: boolean;
  ndaAccepted: boolean;
  taskClaimed: boolean;
}
