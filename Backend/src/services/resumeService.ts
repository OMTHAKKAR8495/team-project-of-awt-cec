import { getJobById } from './jobService';
import {
  extractResumeText,
  extractSkillsFromText,
  calculateATSScore,
  ATSAnalysisResult,
} from '../utils/resumeAnalyzer';
import { cleanupFile } from '../middleware/uploadMiddleware';
import { AppError } from '../middleware/error.middleware';

export interface AnalyzeResumeParams {
  filePath: string;
  mimeType?: string;
  jobId?: string;
  jobTitle?: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  requirements?: string[];
}

export interface DetailedAnalysisResponse extends ATSAnalysisResult {
  jobInfo: {
    id?: string;
    title: string;
    requiredSkills: string[];
    preferredSkills: string[];
  };
}

/**
 * Analyzes an uploaded resume file against job requirements or custom skill parameters
 */
export const analyzeUploadedResume = async (
  params: AnalyzeResumeParams
): Promise<DetailedAnalysisResponse> => {
  const { filePath, mimeType, jobId } = params;

  try {
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
        'At least one required skill must be specified to perform ATS matching analysis.',
        400
      );
    }

    // 1. Extract text from file
    const rawText = await extractResumeText(filePath, mimeType);

    // 2. Extract candidate skills using vocabulary & aliases
    const extractedSkills = extractSkillsFromText(rawText);

    // 3. Compute deterministic ATS score
    const atsResult = calculateATSScore(
      rawText,
      extractedSkills,
      targetRequired,
      targetPreferred,
      targetRequirements
    );

    return {
      ...atsResult,
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
