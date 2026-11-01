import { FilterQuery } from 'mongoose';
import { Job, IJob, IJobDocument, JobStatus, EmploymentType } from '../models/Job';
import { Candidate } from '../models/Candidate';
import { AppError } from '../middleware/error.middleware';
import { isSupabaseReady } from '../config/supabase';
import {
  getJobsFromSupabase,
  getJobByIdFromSupabase,
  createJobInSupabase,
  updateJobInSupabase,
  deleteJobFromSupabase,
} from './supabaseDataService';

export interface JobFilterParams {
  search?: string;
  status?: JobStatus;
  employmentType?: EmploymentType;
  page?: number;
  limit?: number;
}

export interface PaginatedJobsResult {
  jobs: (IJobDocument | ReturnType<typeof import('../config/supabase').formatSupabaseJob>)[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
/**
 * Safely escapes special regular expression characters in user search queries.
 */
export const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createJob = async (jobData: Partial<IJob>): Promise<IJobDocument | ReturnType<typeof import('../config/supabase').formatSupabaseJob>> => {
  if (isSupabaseReady()) {
    return createJobInSupabase({
      title: jobData.title!,
      company: jobData.company!,
      description: jobData.description!,
      location: jobData.location!,
      employmentType: jobData.employmentType,
      requiredSkills: jobData.requiredSkills || [],
      preferredSkills: jobData.preferredSkills,
      requirements: jobData.requirements,
      responsibilities: jobData.responsibilities,
      salaryRange: jobData.salaryRange,
      status: jobData.status,
    }) as unknown as IJobDocument;
  }
  const newJob = await Job.create(jobData);
  return newJob;
};

export const getJobs = async (params: JobFilterParams): Promise<PaginatedJobsResult> => {
  if (isSupabaseReady()) {
    const res = await getJobsFromSupabase(params);
    return res as unknown as PaginatedJobsResult;
  }

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const skip = (page - 1) * limit;

  const query: FilterQuery<IJobDocument> = {};

  if (params.status) {
    query.status = params.status;
  }

  if (params.employmentType) {
    query.employmentType = params.employmentType;
  }

  if (params.search && params.search.trim()) {
    const escapedSearch = escapeRegex(params.search.trim());
    const searchRegex = new RegExp(escapedSearch, 'i');
    query.$or = [
      { title: searchRegex },
      { company: searchRegex },
      { description: searchRegex },
      { requiredSkills: { $in: [searchRegex] } },
    ];
  }

  const [jobs, total] = await Promise.all([
    Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    Job.countDocuments(query).exec(),
  ]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const getJobById = async (id: string): Promise<IJobDocument | ReturnType<typeof import('../config/supabase').formatSupabaseJob>> => {
  if (isSupabaseReady()) {
    return getJobByIdFromSupabase(id) as unknown as IJobDocument;
  }
  const job = await Job.findById(id).exec();
  if (!job) {
    throw new AppError(`Job with ID '${id}' was not found.`, 404);
  }
  return job;
};

export const updateJob = async (id: string, updateData: Partial<IJob>): Promise<IJobDocument | ReturnType<typeof import('../config/supabase').formatSupabaseJob>> => {
  if (isSupabaseReady()) {
    return updateJobInSupabase(id, updateData) as unknown as IJobDocument;
  }
  const updatedJob = await Job.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).exec();

  if (!updatedJob) {
    throw new AppError(`Job with ID '${id}' was not found.`, 404);
  }

  return updatedJob;
};

export const deleteJob = async (id: string): Promise<IJobDocument | { id: string }> => {
  if (isSupabaseReady()) {
    return deleteJobFromSupabase(id);
  }
  const deletedJob = await Job.findByIdAndDelete(id).exec();
  if (!deletedJob) {
    throw new AppError(`Job with ID '${id}' was not found.`, 404);
  }
  // Cascade delete candidate applications for this deleted job
  await Candidate.deleteMany({ job: id }).exec();
  return deletedJob;
};
