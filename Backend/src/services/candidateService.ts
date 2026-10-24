import { FilterQuery, Types } from 'mongoose';
import { Candidate, ICandidateDocument, ApplicationStatus } from '../models/Candidate';
import { Job } from '../models/Job';
import { AppError } from '../middleware/error.middleware';
import {
  extractResumeText,
  extractSkillsFromText,
  calculateATSScore,
} from '../utils/resumeAnalyzer';
import { cleanupFile } from '../middleware/uploadMiddleware';

export interface ApplyCandidateDTO {
  name: string;
  email: string;
  phone?: string;
  jobId: string;
  notes?: string;
  file: Express.Multer.File;
}

export interface CandidateFilterParams {
  jobId?: string;
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedCandidatesResult {
  candidates: ICandidateDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Submits a candidate application, parses resume, computes ATS score, and stores record
 */
export const applyCandidate = async (dto: ApplyCandidateDTO): Promise<ICandidateDocument> => {
  const { name, email, phone, jobId, notes, file } = dto;

  try {
    // 1. Verify Job existence and active status
    const job = await Job.findById(jobId).exec();
    if (!job) {
      throw new AppError(`Job with ID '${jobId}' does not exist.`, 404);
    }

    if (job.status !== 'open') {
      throw new AppError(
        `Job '${job.title}' is currently closed. Applications cannot be accepted.`,
        400
      );
    }

    // 2. Prevent duplicate application for the same job with the same email
    const existing = await Candidate.findOne({
      job: new Types.ObjectId(jobId),
      email: email.toLowerCase(),
    }).exec();

    if (existing) {
      throw new AppError(
        `Candidate with email '${email}' has already submitted an application for this job.`,
        409
      );
    }

    // 3. Extract text from uploaded resume
    const rawText = await extractResumeText(file.path, file.mimetype);

    // 4. Extract skills from resume
    const extractedSkills = extractSkillsFromText(rawText);

    // 5. Calculate ATS match score against Job requirements
    const atsResult = calculateATSScore(
      rawText,
      extractedSkills,
      job.requiredSkills,
      job.preferredSkills || [],
      job.requirements || []
    );

    // 6. Build Candidate record
    const candidate = new Candidate({
      name,
      email: email.toLowerCase(),
      phone,
      job: job._id,
      resume: {
        originalName: file.originalname,
        fileName: file.filename,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
      },
      extractedSkills,
      atsScore: atsResult.score,
      matchedSkills: atsResult.matchedSkills,
      missingSkills: atsResult.missingSkills,
      applicationStatus: 'pending',
      notes,
    });

    const savedCandidate = await candidate.save();
    return savedCandidate;
  } finally {
    // Safely delete temporary file after extraction to protect privacy and disk space
    await cleanupFile(file.path);
  }
};

/**
 * Retrieves paginated candidates with optional job and status filters
 */
export const getCandidates = async (
  params: CandidateFilterParams
): Promise<PaginatedCandidatesResult> => {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const skip = (page - 1) * limit;

  const query: FilterQuery<ICandidateDocument> = {};

  if (params.jobId) {
    query.job = new Types.ObjectId(params.jobId);
  }

  if (params.status) {
    query.applicationStatus = params.status;
  }

  const [candidates, total] = await Promise.all([
    Candidate.find(query)
      .populate('job', 'title company status location')
      .sort({ atsScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    Candidate.countDocuments(query).exec(),
  ]);

  return {
    candidates,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Retrieves a single candidate application by ID
 */
export const getCandidateById = async (id: string): Promise<ICandidateDocument> => {
  const candidate = await Candidate.findById(id)
    .populate('job', 'title company status location requiredSkills')
    .exec();

  if (!candidate) {
    throw new AppError(`Candidate application with ID '${id}' was not found.`, 404);
  }

  return candidate;
};

/**
 * Retrieves all applicants for a specific job, ranked by ATS score
 */
export const getCandidatesByJob = async (
  jobId: string,
  page = 1,
  limit = 20
): Promise<PaginatedCandidatesResult> => {
  // Verify job exists
  const jobExists = await Job.exists({ _id: jobId });
  if (!jobExists) {
    throw new AppError(`Job with ID '${jobId}' was not found.`, 404);
  }

  return getCandidates({ jobId, page, limit });
};

/**
 * Updates application status (e.g., shortlisted, rejected, hired)
 */
export const updateCandidateStatus = async (
  id: string,
  status: ApplicationStatus
): Promise<ICandidateDocument> => {
  const candidate = await Candidate.findByIdAndUpdate(
    id,
    { applicationStatus: status },
    { new: true, runValidators: true }
  )
    .populate('job', 'title company')
    .exec();

  if (!candidate) {
    throw new AppError(`Candidate application with ID '${id}' was not found.`, 404);
  }

  return candidate;
};

/**
 * Updates recruiter notes on an application
 */
export const updateCandidateNotes = async (
  id: string,
  notes: string
): Promise<ICandidateDocument> => {
  const candidate = await Candidate.findByIdAndUpdate(
    id,
    { notes },
    { new: true, runValidators: true }
  ).exec();

  if (!candidate) {
    throw new AppError(`Candidate application with ID '${id}' was not found.`, 404);
  }

  return candidate;
};

export interface UpdateCandidateDTO {
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  status?: ApplicationStatus;
  applicationStatus?: ApplicationStatus;
}

/**
 * Updates candidate application details (contact info, notes, or status)
 */
export const updateCandidate = async (
  id: string,
  updateData: UpdateCandidateDTO
): Promise<ICandidateDocument> => {
  const updates: Record<string, unknown> = {};
  if (updateData.name !== undefined) updates.name = updateData.name;
  if (updateData.email !== undefined) updates.email = updateData.email.toLowerCase();
  if (updateData.phone !== undefined) updates.phone = updateData.phone;
  if (updateData.notes !== undefined) updates.notes = updateData.notes;
  const status = updateData.applicationStatus || updateData.status;
  if (status !== undefined) updates.applicationStatus = status;

  const candidate = await Candidate.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  })
    .populate('job', 'title company')
    .exec();

  if (!candidate) {
    throw new AppError(`Candidate application with ID '${id}' was not found.`, 404);
  }

  return candidate;
};

/**
 * Deletes a candidate application record by ID
 */
export const deleteCandidate = async (id: string): Promise<ICandidateDocument> => {
  const candidate = await Candidate.findByIdAndDelete(id).exec();

  if (!candidate) {
    throw new AppError(`Candidate application with ID '${id}' was not found.`, 404);
  }

  return candidate;
};
