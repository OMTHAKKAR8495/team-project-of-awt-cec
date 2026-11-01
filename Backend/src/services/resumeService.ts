import { getJobById } from './jobService';
import {
  extractResumeText,
  extractSkillsFromText,
  calculateATSScore,
  calculateGeneralResumeScore,
  ATSAnalysisResult,
  GeneralBreakdown,
} from '../utils/resumeAnalyzer';
import { cleanupFile } from '../middleware/uploadMiddleware';
import { AppError } from '../middleware/error.middleware';

export interface AnalyzeResumeParams {
  filePath: string;
  mimeType?: string;
  mode?: 'job' | 'custom' | 'general';
  jobId?: string;
  jobTitle?: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  requirements?: string[];
}

export interface DetailedAnalysisResponse extends ATSAnalysisResult {
  mode?: 'job' | 'custom' | 'general';
  generalBreakdown?: GeneralBreakdown;
  strengths?: string[];
  recommendations?: string[];
  jobInfo: {
    id?: string;
    title: string;
    requiredSkills: string[];
    preferredSkills: string[];
  };
}

/**
 * Analyzes an uploaded resume file against job requirements, custom skill parameters,
 * or performs a comprehensive general ATS quality check.
 */
export const analyzeUploadedResume = async (
  params: AnalyzeResumeParams
): Promise<DetailedAnalysisResponse> => {
  const { filePath, mimeType, jobId, mode } = params;

  try {
    // 1. Extract text from file
    const rawText = await extractResumeText(filePath, mimeType);

    // 2. Extract candidate skills using vocabulary & aliases
    const extractedSkills = extractSkillsFromText(rawText);

    // If General Resume Score mode is requested or no specific target job/skills are provided
    if (mode === 'general' || (!jobId && (!params.requiredSkills || params.requiredSkills.length === 0))) {
      const generalResult = calculateGeneralResumeScore(rawText, extractedSkills);
      return {
        ...generalResult,
        jobInfo: {
          id: undefined,
          title: 'General Resume Quality & ATS Readiness',
          requiredSkills: [],
          preferredSkills: [],
        },
      };
    }

    let targetTitle = params.jobTitle || 'Custom Job Position';
    let targetRequired = params.requiredSkills || [];
    let targetPreferred = params.preferredSkills || [];
    let targetRequirements = params.requirements || [];

    // If jobId is provided, retrieve job specifications from database
    if (jobId) {
      const job = await getJobById(jobId);
      targetTitle = job.title;
      targetRequired = job.requiredSkills;
      targetPreferred = job.preferredSkills || [];
      targetRequirements = job.requirements || [];
    }

    if (!targetRequired || targetRequired.length === 0) {
      throw new AppError(
        'At least one required skill must be specified to perform role-specific ATS matching analysis.',
        400
      );
    }

    // 3. Compute deterministic ATS score against target job requirements
    const atsResult = calculateATSScore(
      rawText,
      extractedSkills,
      targetRequired,
      targetPreferred,
      targetRequirements
    );

    return {
      ...atsResult,
      mode: 'job',
      jobInfo: {
        id: jobId,
        title: targetTitle,
        requiredSkills: targetRequired,
        preferredSkills: targetPreferred,
      },
    };
  } finally {
    // Always remove temporary file from disk after evaluation
    await cleanupFile(filePath);
  }
};
