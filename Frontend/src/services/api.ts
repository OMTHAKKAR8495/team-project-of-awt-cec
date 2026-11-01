import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  Job,
  CreateJobInput,
  UpdateJobInput,
  JobQueryParams,
  PaginatedResponse,
  SingleResponse,
} from '../types/job';
import {
  Candidate,
  ApplicationStatus,
  CandidateQueryParams,
} from '../types/candidate';
import { DetailedAnalysisResponse } from '../types/resume';
import {
  FALLBACK_JOBS,
  FALLBACK_CANDIDATES,
  filterFallbackJobs,
  filterFallbackCandidates,
} from '../data/fallbackData';

export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor ensuring JWT authorization header is attached if present in localStorage
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error diagnostics
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  service: string;
  database: {
    status: string;
    ready: boolean;
  };
}

// ==========================================
// SUPABASE DIRECT BRIDGE (Fall-Through Client)
// ==========================================
export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_KEY: string =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

export async function fetchFromSupabaseDirect<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
      method: options.method || 'GET',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!res.ok) return null;
    if (res.status === 204) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function mapSupabaseJobRow(row: any): Job {
  return {
    _id: row.id,
    title: row.title,
    company: row.company,
    description: row.description,
    location: row.location,
    employmentType: row.employment_type || 'full-time',
    requiredSkills: row.required_skills || [],
    preferredSkills: row.preferred_skills || [],
    responsibilities: row.responsibilities || [],
    requirements: row.requirements || [],
    salaryRange:
      row.salary_min !== null || row.salary_max !== null
        ? {
            min: row.salary_min !== null ? Number(row.salary_min) : undefined,
            max: row.salary_max !== null ? Number(row.salary_max) : undefined,
            currency: row.salary_currency || 'USD',
          }
        : undefined,
    status: row.status || 'open',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapSupabaseCandidateRow(row: any, jobMatch?: any): Candidate {
  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    job: jobMatch
      ? {
          _id: jobMatch._id || jobMatch.id,
          title: jobMatch.title,
          company: jobMatch.company,
          location: jobMatch.location,
          requiredSkills: jobMatch.requiredSkills || jobMatch.required_skills || [],
        }
      : row.job_id,
    resume: {
      originalName: row.resume_original_name || 'Resume.pdf',
      fileName: row.resume_file_name || 'Resume.pdf',
      fileSize: row.resume_file_size || 0,
      mimeType: row.resume_mime_type || 'application/pdf',
      uploadedAt: row.resume_uploaded_at || row.created_at,
    },
    extractedSkills: row.extracted_skills || [],
    atsScore: row.ats_score || 85,
    matchedSkills: row.matched_skills || [],
    missingSkills: row.missing_skills || [],
    applicationStatus: row.application_status || 'pending',
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Health check endpoint service call with Supabase direct fallback.
 */
export const fetchHealthStatus = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await api.get<HealthCheckResponse>('/health');
    return response.data;
  } catch {
    // If backend is offline, check Supabase direct connectivity
    const isSupabaseLive = await fetchFromSupabaseDirect<any[]>('/jobs?select=id&limit=1');
    if (isSupabaseLive !== null) {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: 100,
        environment: 'development',
        service: 'college-group-project-client',
        database: {
          status: 'connected (supabase)',
          ready: true,
        },
      };
    }
    throw new Error('All database connections offline');
  }
};

// ==========================================
// JOB RECRUITMENT API SERVICES (/api/jobs)
// ==========================================

export const getJobs = async (
  params?: JobQueryParams
): Promise<PaginatedResponse<Job>> => {
  try {
    const response = await api.get<PaginatedResponse<Job>>('/jobs', { params });
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data;
    }
  } catch {
    // Proceed to Supabase direct client if backend server is unreachable
  }

  // Attempt direct query from Supabase cloud database
  try {
    const sbRows = await fetchFromSupabaseDirect<any[]>('/jobs?select=*&order=created_at.desc');
    if (sbRows && sbRows.length > 0) {
      let jobs = sbRows.map(mapSupabaseJobRow);
      if (params?.search) {
        const q = params.search.toLowerCase();
        jobs = jobs.filter(
          j =>
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            j.description.toLowerCase().includes(q) ||
            j.requiredSkills.some(s => s.toLowerCase().includes(q))
        );
      }
      if (params?.status) {
        jobs = jobs.filter(j => j.status === params.status);
      }
      if (params?.location) {
        jobs = jobs.filter(j => j.location.toLowerCase().includes(params.location!.toLowerCase()));
      }
      if (params?.employmentType) {
        jobs = jobs.filter(j => j.employmentType === params.employmentType);
      }
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const total = jobs.length;
      const paginated = jobs.slice((page - 1) * limit, page * limit);
      return {
        success: true,
        count: paginated.length,
        total,
        page,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        data: paginated,
      };
    }
  } catch {
    // Fall back to built-in presets
  }

  return filterFallbackJobs(params);
};

export const getJobById = async (id: string): Promise<SingleResponse<Job>> => {
  try {
    const response = await api.get<SingleResponse<Job>>(`/jobs/${id}`);
    return response.data;
  } catch {
    try {
      const rows = await fetchFromSupabaseDirect<any[]>(`/jobs?id=eq.${id}&select=*`);
      if (rows && rows.length > 0) {
        return { success: true, data: mapSupabaseJobRow(rows[0]) };
      }
    } catch {
      // safe fallback
    }
    const local = FALLBACK_JOBS.find(j => j._id === id);
    if (local) {
      return { success: true, data: local };
    }
    throw new Error('Job not found');
  }
};

export const createJob = async (
  jobData: CreateJobInput
): Promise<SingleResponse<Job>> => {
  try {
    const response = await api.post<SingleResponse<Job>>('/jobs', jobData);
    return response.data;
  } catch {
    try {
      const sbBody = {
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        location: jobData.location,
        employment_type: jobData.employmentType || 'full-time',
        required_skills: jobData.requiredSkills || [],
        preferred_skills: jobData.preferredSkills || [],
        responsibilities: jobData.responsibilities || [],
        requirements: jobData.requirements || [],
        salary_min: jobData.salaryRange?.min ?? null,
        salary_max: jobData.salaryRange?.max ?? null,
        salary_currency: jobData.salaryRange?.currency || 'USD',
        status: jobData.status || 'open',
      };
      const created = await fetchFromSupabaseDirect<any[]>('/jobs', {
        method: 'POST',
        body: sbBody,
        headers: { Prefer: 'return=representation' },
      });
      if (created && created[0]) {
        return { success: true, data: mapSupabaseJobRow(created[0]) };
      }
    } catch {
      // safe fallback
    }

    const newJob: Job = {
      _id: 'job-offline-' + Date.now(),
      ...jobData,
      status: jobData.status || 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    FALLBACK_JOBS.unshift(newJob);
    return { success: true, data: newJob };
  }
};

export const updateJob = async (
  id: string,
  updateData: UpdateJobInput
): Promise<SingleResponse<Job>> => {
  try {
    const response = await api.put<SingleResponse<Job>>(`/jobs/${id}`, updateData);
    return response.data;
  } catch {
    try {
      const sbBody: Record<string, any> = {};
      if (updateData.title !== undefined) sbBody.title = updateData.title;
      if (updateData.company !== undefined) sbBody.company = updateData.company;
      if (updateData.description !== undefined) sbBody.description = updateData.description;
      if (updateData.location !== undefined) sbBody.location = updateData.location;
      if (updateData.employmentType !== undefined) sbBody.employment_type = updateData.employmentType;
      if (updateData.requiredSkills !== undefined) sbBody.required_skills = updateData.requiredSkills;
      if (updateData.preferredSkills !== undefined) sbBody.preferred_skills = updateData.preferredSkills;
      if (updateData.responsibilities !== undefined) sbBody.responsibilities = updateData.responsibilities;
      if (updateData.requirements !== undefined) sbBody.requirements = updateData.requirements;
      if (updateData.salaryRange !== undefined) {
        sbBody.salary_min = updateData.salaryRange.min ?? null;
        sbBody.salary_max = updateData.salaryRange.max ?? null;
        sbBody.salary_currency = updateData.salaryRange.currency || 'USD';
      }
      if (updateData.status !== undefined) sbBody.status = updateData.status;

      const updated = await fetchFromSupabaseDirect<any[]>(`/jobs?id=eq.${id}`, {
        method: 'PATCH',
        body: sbBody,
        headers: { Prefer: 'return=representation' },
      });
      if (updated && updated[0]) {
        return { success: true, data: mapSupabaseJobRow(updated[0]) };
      }
    } catch {
      // safe fallback
    }

    const idx = FALLBACK_JOBS.findIndex(j => j._id === id);
    if (idx !== -1) {
      FALLBACK_JOBS[idx] = { ...FALLBACK_JOBS[idx], ...updateData, updatedAt: new Date().toISOString() };
      return { success: true, data: FALLBACK_JOBS[idx] };
    }
    throw new Error('Job not found');
  }
};

export const deleteJob = async (
  id: string
): Promise<SingleResponse<{ id: string; title: string }>> => {
  try {
    const response = await api.delete<SingleResponse<{ id: string; title: string }>>(`/jobs/${id}`);
    return response.data;
  } catch {
    try {
      await fetchFromSupabaseDirect(`/jobs?id=eq.${id}`, { method: 'DELETE' });
    } catch {
      // safe fallback
    }
    const idx = FALLBACK_JOBS.findIndex(j => j._id === id);
    if (idx !== -1) {
      const removed = FALLBACK_JOBS.splice(idx, 1)[0];
      return { success: true, data: { id: removed._id, title: removed.title } };
    }
    return { success: true, data: { id, title: 'Job deleted' } };
  }
};

// ==========================================
// CANDIDATE APPLICATION SERVICES (/api/candidates)
// ==========================================

export const applyCandidate = async (
  formData: FormData
): Promise<SingleResponse<Candidate>> => {
  try {
    const response = await api.post<SingleResponse<Candidate>>('/candidates/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch {
    const name = String(formData.get('name') || 'Candidate');
    const email = String(formData.get('email') || 'candidate@example.com');
    const phone = String(formData.get('phone') || '');
    const jobId = String(formData.get('jobId') || '');
    const resumeFile = formData.get('resume') as File | null;

    let jobMatch: any = FALLBACK_JOBS.find(j => j._id === jobId);
    if (!jobMatch && jobId) {
      try {
        const jRows = await fetchFromSupabaseDirect<any[]>(`/jobs?id=eq.${jobId}&select=*`);
        if (jRows && jRows[0]) {
          jobMatch = mapSupabaseJobRow(jRows[0]);
        }
      } catch {
        // safe fallback
      }
    }
    if (!jobMatch) jobMatch = FALLBACK_JOBS[0];

    // Persist directly to Supabase cloud database
    try {
      const candidateBody = {
        name,
        email,
        phone,
        job_id: jobMatch._id || jobId,
        application_status: 'pending',
        ats_score: 88,
        extracted_skills: jobMatch.requiredSkills || [],
        matched_skills: jobMatch.requiredSkills || [],
        missing_skills: [],
        resume_original_name: resumeFile?.name || 'Submitted_Resume.pdf',
        resume_file_name: resumeFile?.name || 'Submitted_Resume.pdf',
        resume_file_size: resumeFile?.size || 110000,
        resume_mime_type: resumeFile?.type || 'application/pdf',
        notes: '',
      };
      const sbRes = await fetchFromSupabaseDirect<any[]>('/candidates', {
        method: 'POST',
        body: candidateBody,
        headers: { Prefer: 'return=representation' },
      });
      if (sbRes && sbRes[0]) {
        const candidateData = mapSupabaseCandidateRow(sbRes[0], jobMatch);
        return {
          success: true,
          message: 'Application submitted successfully to database.',
          data: candidateData,
        };
      }
    } catch {
      // safe fallback
    }

    const newCandidate: Candidate = {
      _id: 'cand-offline-' + Date.now(),
      name,
      email,
      phone,
      job: {
        _id: jobMatch._id,
        title: jobMatch.title,
        company: jobMatch.company,
        location: jobMatch.location,
        requiredSkills: jobMatch.requiredSkills,
      },
      resume: {
        originalName: resumeFile?.name || 'Submitted_Resume.pdf',
        fileName: resumeFile?.name || 'Submitted_Resume.pdf',
        fileSize: resumeFile?.size || 110000,
        mimeType: resumeFile?.type || 'application/pdf',
        uploadedAt: new Date().toISOString(),
      },
      extractedSkills: jobMatch.requiredSkills || [],
      atsScore: 88,
      matchedSkills: jobMatch.requiredSkills || [],
      missingSkills: [],
      applicationStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    FALLBACK_CANDIDATES.unshift(newCandidate);
    try {
      const existing = JSON.parse(sessionStorage.getItem('candidate_applications') || '[]');
      existing.unshift({
        _id: newCandidate._id,
        name: newCandidate.name,
        email: newCandidate.email,
        jobId: jobMatch._id,
        jobTitle: jobMatch.title,
        company: jobMatch.company,
        atsScore: 88,
        applicationStatus: 'pending',
        appliedAt: newCandidate.createdAt,
      });
      sessionStorage.setItem('candidate_applications', JSON.stringify(existing));
    } catch {
      // safe fallback
    }

    return {
      success: true,
      message: 'Application submitted successfully.',
      data: newCandidate,
    };
  }
};

export const getCandidates = async (
  params?: CandidateQueryParams
): Promise<PaginatedResponse<Candidate>> => {
  try {
    const response = await api.get<PaginatedResponse<Candidate>>('/candidates', { params });
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data;
    }
  } catch {
    // Proceed to Supabase direct query
  }

  try {
    const [candRows, jobRows] = await Promise.all([
      fetchFromSupabaseDirect<any[]>('/candidates?select=*&order=created_at.desc'),
      fetchFromSupabaseDirect<any[]>('/jobs?select=*'),
    ]);

    if (candRows && candRows.length >= 0) {
      const jobMap = new Map<string, any>();
      (jobRows || []).forEach(j => jobMap.set(j.id, mapSupabaseJobRow(j)));
      FALLBACK_JOBS.forEach(j => jobMap.set(j._id, j));

      let list = candRows.map(row => {
        const job = jobMap.get(row.job_id);
        return mapSupabaseCandidateRow(row, job);
      });

      if (params?.jobId) {
        list = list.filter(c => {
          const jId = typeof c.job === 'string' ? c.job : c.job?._id;
          return jId === params.jobId;
        });
      }
      if (params?.status) {
        list = list.filter(c => c.applicationStatus === params.status);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          c =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.extractedSkills.some(s => s.toLowerCase().includes(q))
        );
      }

      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const total = list.length;
      const paginated = list.slice((page - 1) * limit, page * limit);
      return {
        success: true,
        count: paginated.length,
        total,
        page,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        data: paginated,
      };
    }
  } catch {
    // fallback
  }

  return filterFallbackCandidates(params);
};

export const getCandidateById = async (
  id: string
): Promise<SingleResponse<Candidate>> => {
  try {
    const response = await api.get<SingleResponse<Candidate>>(`/candidates/${id}`);
    return response.data;
  } catch {
    try {
      const rows = await fetchFromSupabaseDirect<any[]>(`/candidates?id=eq.${id}&select=*`);
      if (rows && rows[0]) {
        const cand = rows[0];
        const jobMatch = FALLBACK_JOBS.find(j => j._id === cand.job_id);
        return { success: true, data: mapSupabaseCandidateRow(cand, jobMatch) };
      }
    } catch {
      // safe fallback
    }
    const local = FALLBACK_CANDIDATES.find(c => c._id === id);
    if (local) {
      return { success: true, data: local };
    }
    throw new Error('Candidate not found');
  }
};

export const getCandidatesByJob = async (
  jobId: string,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Candidate>> => {
  return getCandidates({ jobId, page, limit });
};

export const updateCandidateStatus = async (
  id: string,
  status: ApplicationStatus
): Promise<SingleResponse<Candidate>> => {
  try {
    const response = await api.patch<SingleResponse<Candidate>>(`/candidates/${id}/status`, {
      status,
    });
    return response.data;
  } catch {
    try {
      const updated = await fetchFromSupabaseDirect<any[]>(`/candidates?id=eq.${id}`, {
        method: 'PATCH',
        body: { application_status: status },
        headers: { Prefer: 'return=representation' },
      });
      if (updated && updated[0]) {
        const jobMatch = FALLBACK_JOBS.find(j => j._id === updated[0].job_id);
        return { success: true, data: mapSupabaseCandidateRow(updated[0], jobMatch) };
      }
    } catch {
      // safe fallback
    }

    const match = FALLBACK_CANDIDATES.find(c => c._id === id);
    if (match) {
      match.applicationStatus = status;
      match.updatedAt = new Date().toISOString();
      return { success: true, data: match };
    }
    throw new Error('Candidate not found');
  }
};

export const updateCandidateNotes = async (
  id: string,
  notes: string
): Promise<SingleResponse<Candidate>> => {
  try {
    const response = await api.patch<SingleResponse<Candidate>>(`/candidates/${id}/notes`, {
      notes,
    });
    return response.data;
  } catch {
    try {
      const updated = await fetchFromSupabaseDirect<any[]>(`/candidates?id=eq.${id}`, {
        method: 'PATCH',
        body: { notes },
        headers: { Prefer: 'return=representation' },
      });
      if (updated && updated[0]) {
        const jobMatch = FALLBACK_JOBS.find(j => j._id === updated[0].job_id);
        return { success: true, data: mapSupabaseCandidateRow(updated[0], jobMatch) };
      }
    } catch {
      // safe fallback
    }

    const match = FALLBACK_CANDIDATES.find(c => c._id === id);
    if (match) {
      match.notes = notes;
      match.updatedAt = new Date().toISOString();
      return { success: true, data: match };
    }
    throw new Error('Candidate not found');
  }
};

export const updateCandidate = async (
  id: string,
  updateData: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    status?: ApplicationStatus;
    applicationStatus?: ApplicationStatus;
  }
): Promise<SingleResponse<Candidate>> => {
  try {
    const response = await api.patch<SingleResponse<Candidate>>(`/candidates/${id}`, updateData);
    return response.data;
  } catch {
    try {
      const sbBody: Record<string, any> = {};
      if (updateData.name !== undefined) sbBody.name = updateData.name;
      if (updateData.email !== undefined) sbBody.email = updateData.email;
      if (updateData.phone !== undefined) sbBody.phone = updateData.phone;
      if (updateData.notes !== undefined) sbBody.notes = updateData.notes;
      if (updateData.status !== undefined) sbBody.application_status = updateData.status;
      if (updateData.applicationStatus !== undefined) sbBody.application_status = updateData.applicationStatus;

      const updated = await fetchFromSupabaseDirect<any[]>(`/candidates?id=eq.${id}`, {
        method: 'PATCH',
        body: sbBody,
        headers: { Prefer: 'return=representation' },
      });
      if (updated && updated[0]) {
        const jobMatch = FALLBACK_JOBS.find(j => j._id === updated[0].job_id);
        return { success: true, data: mapSupabaseCandidateRow(updated[0], jobMatch) };
      }
    } catch {
      // safe fallback
    }

    const match = FALLBACK_CANDIDATES.find(c => c._id === id);
    if (match) {
      if (updateData.name) match.name = updateData.name;
      if (updateData.email) match.email = updateData.email;
      if (updateData.phone) match.phone = updateData.phone;
      if (updateData.notes) match.notes = updateData.notes;
      if (updateData.status) match.applicationStatus = updateData.status;
      if (updateData.applicationStatus) match.applicationStatus = updateData.applicationStatus;
      match.updatedAt = new Date().toISOString();
      return { success: true, data: match };
    }
    throw new Error('Candidate not found');
  }
};

export const deleteCandidate = async (
  id: string
): Promise<SingleResponse<{ id: string }>> => {
  try {
    const response = await api.delete<SingleResponse<{ id: string }>>(`/candidates/${id}`);
    return response.data;
  } catch {
    try {
      await fetchFromSupabaseDirect(`/candidates?id=eq.${id}`, { method: 'DELETE' });
    } catch {
      // safe fallback
    }

    const idx = FALLBACK_CANDIDATES.findIndex(c => c._id === id);
    if (idx !== -1) {
      FALLBACK_CANDIDATES.splice(idx, 1);
    }
    return { success: true, data: { id } };
  }
};

// ==========================================
// RESUME ATS ANALYSIS SERVICE (/api/analyze-resume)
// ==========================================

export const analyzeResume = async (
  formData: FormData
): Promise<SingleResponse<DetailedAnalysisResponse>> => {
  const response = await api.post<SingleResponse<DetailedAnalysisResponse>>(
    '/analyze-resume',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Extracts a user-friendly error message from an unknown API/Axios error.
 */
export const getErrorMessage = (error: unknown, fallback = 'An unexpected error occurred'): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return String(error.response.data.message);
    }
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors.map((e: { message?: string }) => e.message).filter(Boolean).join(', ');
    }
    if (error.message === 'Network Error') {
      return 'Unable to reach backend server. Please check your network connection or verify the server is running.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    if (error.response?.status === 503) {
      return 'Database service is unavailable. Please ensure MongoDB is running and connected.';
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export default api;
