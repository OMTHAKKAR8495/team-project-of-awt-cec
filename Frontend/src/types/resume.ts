export interface ATSBreakdown {
  requiredSkillsTotal: number;
  requiredSkillsMatched: number;
  preferredSkillsTotal: number;
  preferredSkillsMatched: number;
  requiredCoveragePercent: number;
}

export interface DetailedAnalysisResponse {
  score: number;
  breakdown: ATSBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  extractedSkills: string[];
  explanation: string;
  jobInfo: {
    id?: string;
    title: string;
    requiredSkills: string[];
    preferredSkills: string[];
  };
}
