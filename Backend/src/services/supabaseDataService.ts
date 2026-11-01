/**
 * Supabase Data Service
 * Implements job, candidate, and authentication data operations against Supabase PostgreSQL.
 */

import {
  supabaseRequest,
  RawSupabaseJob,
  RawSupabaseCandidate,
  formatSupabaseJob,
  formatSupabaseCandidate,
  isSupabaseConfigured,
  isSupabaseReady,
} from '../config/supabase';
import { JobStatus, EmploymentType } from '../models/Job';
import { ApplicationStatus } from '../models/Candidate';
import { AppError } from '../middleware/error.middleware';

/**
 * Encodes URL parameter components used in Supabase REST queries.
 */
export function encodeFilterValue(val: string): string {
  return encodeURIComponent(String(val).trim());
}

// ─────────────────────────────────────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────────────────────────────────────

export interface SupabaseJobFilterParams {
  search?: string;
  status?: JobStatus;
  employmentType?: EmploymentType;
  page?: number;
  limit?: number;
}

export async function getJobsFromSupabase(params: SupabaseJobFilterParams = {}) {
  const queryParts: string[] = ['select=*', 'order=created_at.desc'];

  if (params.status) {
    queryParts.push(`status=eq.${params.status}`);
  }
  if (params.employmentType) {
    queryParts.push(`employment_type=eq.${params.employmentType}`);
  }

  const endpoint = `/jobs?${queryParts.join('&')}`;
  let rows = await supabaseRequest<RawSupabaseJob[]>(endpoint);

  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    rows = rows.filter(
      j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.required_skills && j.required_skills.some(s => s.toLowerCase().includes(q)))
    );
  }

  const total = rows.length;
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const start = (page - 1) * limit;
  const paginated = rows.slice(start, start + limit);

  return {
    jobs: paginated.map(formatSupabaseJob),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getJobByIdFromSupabase(id: string) {
  const rows = await supabaseRequest<RawSupabaseJob[]>(`/jobs?id=eq.${encodeFilterValue(id)}&select=*`);
  if (!rows || rows.length === 0) {
    throw new AppError(`Job with ID '${id}' was not found.`, 404);
  }
  return formatSupabaseJob(rows[0]);
}

export async function createJobInSupabase(jobData: {
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType?: EmploymentType;
  requiredSkills: string[];
  preferredSkills?: string[];
  requirements?: string[];
  responsibilities?: string[];
  salaryRange?: { min?: number; max?: number; currency?: string };
  status?: JobStatus;
}) {
  const payload = {
    title: jobData.title,
    company: jobData.company,
    description: jobData.description,
    location: jobData.location,
    employment_type: jobData.employmentType || 'full-time',
    required_skills: jobData.requiredSkills || [],
    preferred_skills: jobData.preferredSkills || [],
    requirements: jobData.requirements || [],
    responsibilities: jobData.responsibilities || [],
    salary_min: jobData.salaryRange?.min ?? null,
    salary_max: jobData.salaryRange?.max ?? null,
    salary_currency: jobData.salaryRange?.currency || 'USD',
    status: jobData.status || 'open',
  };

  const rows = await supabaseRequest<RawSupabaseJob[]>('/jobs', {
    method: 'POST',
    body: payload,
    headers: {
      Prefer: 'return=representation',
    },
  });

  return formatSupabaseJob(rows[0]);
}

export async function updateJobInSupabase(
  id: string,
  jobData: Partial<{
    title: string;
    company: string;
    description: string;
    location: string;
    employmentType: EmploymentType;
    requiredSkills: string[];
    preferredSkills: string[];
    requirements: string[];
    responsibilities: string[];
    salaryRange: { min?: number; max?: number; currency?: string };
    status: JobStatus;
  }>
) {
  const payload: Record<string, unknown> = {};
  if (jobData.title) payload.title = jobData.title;
  if (jobData.company) payload.company = jobData.company;
  if (jobData.description) payload.description = jobData.description;
  if (jobData.location) payload.location = jobData.location;
  if (jobData.employmentType) payload.employment_type = jobData.employmentType;
  if (jobData.requiredSkills) payload.required_skills = jobData.requiredSkills;
  if (jobData.preferredSkills) payload.preferred_skills = jobData.preferredSkills;
  if (jobData.requirements) payload.requirements = jobData.requirements;
  if (jobData.responsibilities) payload.responsibilities = jobData.responsibilities;
  if (jobData.salaryRange) {
    if (jobData.salaryRange.min !== undefined) payload.salary_min = jobData.salaryRange.min;
    if (jobData.salaryRange.max !== undefined) payload.salary_max = jobData.salaryRange.max;
    if (jobData.salaryRange.currency) payload.salary_currency = jobData.salaryRange.currency;
  }
  if (jobData.status) payload.status = jobData.status;

  const rows = await supabaseRequest<RawSupabaseJob[]>(`/jobs?id=eq.${encodeFilterValue(id)}`, {
    method: 'PATCH',
    body: payload,
    headers: {
      Prefer: 'return=representation',
    },
  });

  if (!rows || rows.length === 0) {
    throw new AppError(`Job with ID '${id}' was not found.`, 404);
  }

  return formatSupabaseJob(rows[0]);
}

export async function deleteJobFromSupabase(id: string) {
  const encodedId = encodeFilterValue(id);
  // Ensure candidates for this job are deleted (equivalently to MongoDB cascade deletion)
  try {
    await supabaseRequest(`/candidates?job_id=eq.${encodedId}`, {
      method: 'DELETE',
    });
  } catch {
    // If foreign-key ON DELETE CASCADE already removes them, this is safe
  }

  const rows = await supabaseRequest<RawSupabaseJob[]>(`/jobs?id=eq.${encodedId}`, {
    method: 'DELETE',
    headers: {
      Prefer: 'return=representation',
    },
  });

  if (!rows || rows.length === 0) {
    throw new AppError(`Job with ID '${id}' was not found.`, 404);
  }

  return { id };
}

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATES
// ─────────────────────────────────────────────────────────────────────────────

export interface SupabaseCandidateFilterParams {
  jobId?: string;
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
}

export async function getCandidatesFromSupabase(params: SupabaseCandidateFilterParams = {}) {
  const queryParts: string[] = ['select=*', 'order=created_at.desc'];

  if (params.jobId) {
    queryParts.push(`job_id=eq.${encodeFilterValue(params.jobId)}`);
  }
  if (params.status) {
    queryParts.push(`application_status=eq.${params.status}`);
  }

  const rows = await supabaseRequest<RawSupabaseCandidate[]>(`/candidates?${queryParts.join('&')}`);

  // Fetch job records to populate candidate.job
  const jobIds = [...new Set(rows.map(r => r.job_id))];
  const jobMap = new Map<string, RawSupabaseJob>();

  if (jobIds.length > 0) {
    try {
      const jobs = await supabaseRequest<RawSupabaseJob[]>(
        `/jobs?id=in.(${jobIds.map(encodeFilterValue).join(',')})&select=*`
      );
      for (const j of jobs) {
        jobMap.set(j.id, j);
      }
    } catch {
      // safe fallback
    }
  }

  const total = rows.length;
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const start = (page - 1) * limit;
  const paginated = rows.slice(start, start + limit);

  return {
    candidates: paginated.map(r => formatSupabaseCandidate(r, jobMap.get(r.job_id))),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getCandidateByIdFromSupabase(id: string) {
  const rows = await supabaseRequest<RawSupabaseCandidate[]>(`/candidates?id=eq.${encodeFilterValue(id)}&select=*`);
  if (!rows || rows.length === 0) {
    throw new AppError(`Candidate with ID '${id}' was not found.`, 404);
  }

  let jobRow: RawSupabaseJob | null = null;
  try {
    const jobs = await supabaseRequest<RawSupabaseJob[]>(`/jobs?id=eq.${encodeFilterValue(rows[0].job_id)}&select=*`);
    if (jobs && jobs.length > 0) jobRow = jobs[0];
  } catch {
    // safe fallback
  }

  return formatSupabaseCandidate(rows[0], jobRow);
}

export async function findCandidateByJobAndEmailInSupabase(jobId: string, email: string) {
  const rows = await supabaseRequest<RawSupabaseCandidate[]>(
    `/candidates?job_id=eq.${encodeFilterValue(jobId)}&email=eq.${encodeFilterValue(email.toLowerCase().trim())}&select=*`
  );
  if (!rows || rows.length === 0) return null;
  return formatSupabaseCandidate(rows[0]);
}

export async function createCandidateInSupabase(candidateData: {
  name: string;
  email: string;
  phone?: string;
  jobId: string;
  notes?: string;
  resumeOriginalName: string;
  resumeFileName: string;
  resumeFileSize: number;
  resumeMimeType: string;
  extractedSkills: string[];
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}) {
  const payload = {
    name: candidateData.name,
    email: candidateData.email.toLowerCase(),
    phone: candidateData.phone || null,
    job_id: candidateData.jobId,
    resume_original_name: candidateData.resumeOriginalName,
    resume_file_name: candidateData.resumeFileName,
    resume_file_size: candidateData.resumeFileSize,
    resume_mime_type: candidateData.resumeMimeType,
    resume_uploaded_at: new Date().toISOString(),
    extracted_skills: candidateData.extractedSkills,
    ats_score: candidateData.atsScore,
    matched_skills: candidateData.matchedSkills,
    missing_skills: candidateData.missingSkills,
    application_status: 'pending',
    notes: candidateData.notes || null,
  };

  const rows = await supabaseRequest<RawSupabaseCandidate[]>('/candidates', {
    method: 'POST',
    body: payload,
    headers: {
      Prefer: 'return=representation',
    },
  });

  let jobRow: RawSupabaseJob | null = null;
  try {
    const jobs = await supabaseRequest<RawSupabaseJob[]>(`/jobs?id=eq.${encodeFilterValue(candidateData.jobId)}&select=*`);
    if (jobs && jobs.length > 0) jobRow = jobs[0];
  } catch {
    // safe fallback
  }

  return formatSupabaseCandidate(rows[0], jobRow);
}

export async function updateCandidateInSupabase(
  id: string,
  updateData: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    status?: ApplicationStatus;
    applicationStatus?: ApplicationStatus;
  }
) {
  const payload: Record<string, unknown> = {};
  if (updateData.name !== undefined) payload.name = updateData.name;
  if (updateData.email !== undefined) payload.email = updateData.email.toLowerCase().trim();
  if (updateData.phone !== undefined) payload.phone = updateData.phone;
  if (updateData.notes !== undefined) payload.notes = updateData.notes;
  const status = updateData.applicationStatus || updateData.status;
  if (status !== undefined) payload.application_status = status;

  const rows = await supabaseRequest<RawSupabaseCandidate[]>(
    `/candidates?id=eq.${encodeFilterValue(id)}`,
    {
      method: 'PATCH',
      body: payload,
      headers: {
        Prefer: 'return=representation',
      },
    }
  );

  if (!rows || rows.length === 0) {
    throw new AppError(`Candidate with ID '${id}' was not found.`, 404);
  }

  let jobRow: RawSupabaseJob | null = null;
  try {
    const jobs = await supabaseRequest<RawSupabaseJob[]>(
      `/jobs?id=eq.${encodeFilterValue(rows[0].job_id)}&select=*`
    );
    if (jobs && jobs.length > 0) jobRow = jobs[0];
  } catch {
    // safe fallback
  }

  return formatSupabaseCandidate(rows[0], jobRow);
}

export async function updateCandidateStatusInSupabase(id: string, status: ApplicationStatus) {
  return updateCandidateInSupabase(id, { applicationStatus: status });
}

export async function updateCandidateNotesInSupabase(id: string, notes: string) {
  return updateCandidateInSupabase(id, { notes });
}

export async function deleteCandidateFromSupabase(id: string) {
  const rows = await supabaseRequest<RawSupabaseCandidate[]>(
    `/candidates?id=eq.${encodeFilterValue(id)}`,
    {
      method: 'DELETE',
      headers: {
        Prefer: 'return=representation',
      },
    }
  );

  if (!rows || rows.length === 0) {
    throw new AppError(`Candidate with ID '${id}' was not found.`, 404);
  }

  return { id };
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS & AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

export interface RawSupabaseUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'recruiter' | 'candidate';
  created_at: string;
  updated_at: string;
}

export async function findUserByEmailInSupabase(email: string) {
  const rows = await supabaseRequest<RawSupabaseUser[]>(
    `/users?email=eq.${encodeFilterValue(email.toLowerCase())}&select=*`
  );
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

export async function createUserInSupabase(userData: {
  name: string;
  email: string;
  passwordHash: string;
  role: 'recruiter' | 'candidate';
}) {
  const rows = await supabaseRequest<RawSupabaseUser[]>('/users', {
    method: 'POST',
    body: {
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password_hash: userData.passwordHash,
      role: userData.role,
    },
    headers: {
      Prefer: 'return=representation',
    },
  });
  return rows[0];
}

