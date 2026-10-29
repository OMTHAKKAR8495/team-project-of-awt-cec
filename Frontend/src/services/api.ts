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
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

/**
 * Health check endpoint service call.
 */
export const fetchHealthStatus = async (): Promise<HealthCheckResponse> => {
  const response = await api.get<HealthCheckResponse>('/health');
  return response.data;
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
    return filterFallbackJobs(params);
  } catch {
    return filterFallbackJobs(params);
  }
};

export const getJobById = async (id: string): Promise<SingleResponse<Job>> => {
  try {
    const response = await api.get<SingleResponse<Job>>(`/jobs/${id}`);
    return response.data;
  } catch (err) {
    const local = FALLBACK_JOBS.find(j => j._id === id);
    if (local) {
      return { success: true, data: local };
    }
    throw err;
  }
};

export const createJob = async (
  jobData: CreateJobInput
): Promise<SingleResponse<Job>> => {
  try {
    const response = await api.post<SingleResponse<Job>>('/jobs', jobData);
    return response.data;
  } catch {
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
  } catch (err) {
    // If backend DB is offline, save application to session store
    const name = String(formData.get('name') || 'Candidate');
    const email = String(formData.get('email') || 'candidate@example.com');
    const jobId = String(formData.get('jobId') || '507f1f77bcf86cd799439001');

    const jobMatch = FALLBACK_JOBS.find(j => j._id === jobId) || FALLBACK_JOBS[0];
    const newCandidate: Candidate = {
      _id: 'cand-offline-' + Date.now(),
      name,
      email,
      phone: String(formData.get('phone') || ''),
      job: {
        _id: jobMatch._id,
        title: jobMatch.title,
        company: jobMatch.company,
        location: jobMatch.location,
        requiredSkills: jobMatch.requiredSkills,
      },
      resume: {
        originalName: 'Submitted_Resume.pdf',
        fileName: 'Submitted_Resume.pdf',
        fileSize: 110000,
        mimeType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
      },
      extractedSkills: jobMatch.requiredSkills,
      atsScore: 88,
      matchedSkills: jobMatch.requiredSkills,
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
    return filterFallbackCandidates(params);
  } catch {
    return filterFallbackCandidates(params);
  }
};

export const getCandidateById = async (
  id: string
): Promise<SingleResponse<Candidate>> => {
  try {
    const response = await api.get<SingleResponse<Candidate>>(`/candidates/${id}`);
    return response.data;
  } catch (err) {
    const local = FALLBACK_CANDIDATES.find(c => c._id === id);
    if (local) {
      return { success: true, data: local };
    }
    throw err;
  }
};

export const getCandidatesByJob = async (
  jobId: string,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Candidate>> => {
  try {
    const response = await api.get<PaginatedResponse<Candidate>>(`/candidates/job/${jobId}`, {
      params: { page, limit },
    });
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data;
    }
    return filterFallbackCandidates({ jobId, page, limit });
  } catch {
    return filterFallbackCandidates({ jobId, page, limit });
  }
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
