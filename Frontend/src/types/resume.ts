export interface ATSBreakdown {
  requiredSkillsTotal: number;
  requiredSkillsMatched: number;
  preferredSkillsTotal: number;
  preferredSkillsMatched: number;
  requiredCoveragePercent: number;
}

export interface GeneralBreakdown {
  structureScore: number;
  skillsScore: number;
  impactScore: number;
  completenessScore: number;
  wordCount: number;
  sectionsDetected: string[];
  missingSections: string[];
  actionVerbsCount: number;
  quantifiableMetricsCount: number;
}

export interface DetailedAnalysisResponse {
  score: number;
  mode?: 'job' | 'custom' | 'general';
  breakdown: ATSBreakdown;
  generalBreakdown?: GeneralBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  extractedSkills: string[];
  explanation: string;
  strengths?: string[];
  recommendations?: string[];
  jobInfo: {
    id?: string;
    title: string;
    requiredSkills: string[];
    preferredSkills: string[];
  };
}
