import crypto from 'crypto';
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
import { isSupabaseReady, supabaseRequest } from '../config/supabase';
import { encodeFilterValue } from './supabaseDataService';

export interface AnalyzeResumeParams {
  filePath: string;
  mimeType?: string;
  resumeName?: string;
  mode?: 'job' | 'custom' | 'general';
  jobId?: string;
  jobTitle?: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  requirements?: string[];
}

export interface DetailedAnalysisResponse extends ATSAnalysisResult {
  _id?: string;
  id?: string;
  resumeName?: string;
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
  createdAt?: string;
}

// In-memory persistent history cache across evaluations
const localAnalysisHistory: DetailedAnalysisResponse[] = [];

/**
 * Persists an evaluation record to Supabase, MongoDB, and in-memory history cache.
 */
export const saveResumeAnalysisRecord = async (
  record: DetailedAnalysisResponse
): Promise<DetailedAnalysisResponse> => {
  // Prepend to in-memory list (limit to 50 items)
  localAnalysisHistory.unshift(record);
  if (localAnalysisHistory.length > 50) {
    localAnalysisHistory.pop();
  }

  // 1. Persist to Supabase if configured and connected
  if (isSupabaseReady()) {
    try {
      const payload = {
        id: record.id,
        resume_name: record.resumeName || 'Uploaded Resume',
        mode: record.mode || 'job',
        job_id: record.jobInfo.id || null,
        target_title: record.jobInfo.title || 'General Resume Quality',
        score: record.score,
        extracted_skills: record.extractedSkills || [],
        matched_skills: record.matchedSkills || [],
        missing_skills: record.missingSkills || [],
        explanation: record.explanation || '',
        breakdown: record.breakdown || {},
        general_breakdown: record.generalBreakdown || null,
        strengths: record.strengths || [],
        recommendations: record.recommendations || [],
        created_at: record.createdAt || new Date().toISOString(),
      };

      await supabaseRequest('/resume_analyses', {
        method: 'POST',
        body: payload,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('PGRST205') || msg.includes('does not exist')) {
        console.warn('[Supabase] resume_analyses table not yet initialized. Storing in local history buffer.');
      } else {
        console.warn(`[Supabase] Note on saving resume analysis: ${msg}`);
      }
    }
  }

  return record;
};

/**
 * Retrieves past resume ATS analysis history from Supabase, or local buffer fallback.
 */
export const getResumeAnalysisHistory = async (limit = 20): Promise<DetailedAnalysisResponse[]> => {
  // 1. Try Supabase
  if (isSupabaseReady()) {
    try {
      const rows = await supabaseRequest<any[]>(
        `/resume_analyses?select=*&order=created_at.desc&limit=${Math.min(100, Math.max(1, limit))}`
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map(r => ({
          _id: r.id,
          id: r.id,
          resumeName: r.resume_name,
          mode: r.mode,
          score: r.score,
          extractedSkills: r.extracted_skills || [],
          matchedSkills: r.matched_skills || [],
          missingSkills: r.missing_skills || [],
          explanation: r.explanation,
          breakdown: r.breakdown || {},
          generalBreakdown: r.general_breakdown,
          strengths: r.strengths || [],
          recommendations: r.recommendations || [],
          jobInfo: {
            id: r.job_id || undefined,
            title: r.target_title,
            requiredSkills: [],
            preferredSkills: [],
          },
          createdAt: r.created_at,
        }));
      }
    } catch {
      // Fallback
    }
  }

  // 2. Fallback to local memory buffer
  return localAnalysisHistory.slice(0, limit);
};

/**
 * Deletes a single analysis record by ID.
 */
export const deleteResumeAnalysisById = async (id: string): Promise<boolean> => {
  const localIndex = localAnalysisHistory.findIndex(i => i.id === id || i._id === id);
  if (localIndex !== -1) {
    localAnalysisHistory.splice(localIndex, 1);
  }

  if (isSupabaseReady()) {
    try {
      await supabaseRequest(`/resume_analyses?id=eq.${encodeFilterValue(id)}`, {
        method: 'DELETE',
      });
    } catch {
      // safe fallback
    }
  }

  return true;
};

/**
 * Clears all analysis records.
 */
export const clearResumeAnalysisHistory = async (): Promise<boolean> => {
  localAnalysisHistory.length = 0;

  if (isSupabaseReady()) {
    try {
      await supabaseRequest(`/resume_analyses?id=not.is.null`, {
        method: 'DELETE',
      });
    } catch {
      // safe fallback
    }
  }

  return true;
};

/**
 * Analyzes an uploaded resume file against job requirements, custom skill parameters,
 * or performs a comprehensive general ATS quality check, then persists the record.
 */
export const analyzeUploadedResume = async (
  params: AnalyzeResumeParams
): Promise<DetailedAnalysisResponse> => {
  const { filePath, mimeType, jobId, mode } = params;
  const analysisId = crypto.randomUUID();
  const createdAtIso = new Date().toISOString();

  try {
    // 1. Extract text from file
    const rawText = await extractResumeText(filePath, mimeType);

    // 2. Extract candidate skills using vocabulary & aliases
    const extractedSkills = extractSkillsFromText(rawText);

    // If General Resume Score mode is requested or no specific target job/skills are provided
    if (mode === 'general' || (!mode && !jobId && !params.jobTitle && (!params.requiredSkills || params.requiredSkills.length === 0))) {
      const generalResult = calculateGeneralResumeScore(rawText, extractedSkills);
      const response: DetailedAnalysisResponse = {
        _id: analysisId,
        id: analysisId,
        resumeName: params.resumeName || 'Uploaded Resume',
        ...generalResult,
        mode: 'general',
        jobInfo: {
          id: undefined,
          title: 'General Resume Quality & ATS Readiness',
          requiredSkills: [],
          preferredSkills: [],
        },
        createdAt: createdAtIso,
      };

      // Persist to database history
      await saveResumeAnalysisRecord(response);
      return response;
    }

    let targetTitle = params.jobTitle || 'Custom Job Position';
    let targetRequired = params.requiredSkills || [];
    let targetPreferred = params.preferredSkills || [];
    let targetRequirements = params.requirements || [];

    // If jobId is provided, retrieve job specifications from database or offline catalog
    if (jobId) {
      try {
        const job = await getJobById(jobId);
        targetTitle = job.title || targetTitle;
        targetRequired = job.requiredSkills && job.requiredSkills.length > 0 ? job.requiredSkills : targetRequired;
        targetPreferred = job.preferredSkills || targetPreferred;
        targetRequirements = job.requirements || targetRequirements;
      } catch (jobErr) {
        if (!targetRequired || targetRequired.length === 0) {
          throw jobErr;
        }
      }
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

    const response: DetailedAnalysisResponse = {
      _id: analysisId,
      id: analysisId,
      resumeName: params.resumeName || 'Uploaded Resume',
      ...atsResult,
      mode: jobId ? 'job' : 'custom',
      jobInfo: {
        id: jobId,
        title: targetTitle,
        requiredSkills: targetRequired,
        preferredSkills: targetPreferred,
      },
      createdAt: createdAtIso,
    };

    // Persist to database history
    await saveResumeAnalysisRecord(response);
    return response;
  } finally {
    // Always remove temporary file from disk after evaluation
    await cleanupFile(filePath);
  }
};
