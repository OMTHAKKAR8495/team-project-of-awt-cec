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
  CandidateQueryParams,
  ApplicationStatus,
} from '../types/candidate';
import { DetailedAnalysisResponse } from '../types/resume';

// Resolve API base URL from environment or fallback to standard local port
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

/**
 * Reusable, centralized Axios instance configured for the application.
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  config => {
    return config;
  },
  (error: AxiosError) => {
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
  const response = await api.get<PaginatedResponse<Job>>('/jobs', { params });
  return response.data;
};

export const getJobById = async (id: string): Promise<SingleResponse<Job>> => {
  const response = await api.get<SingleResponse<Job>>(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (
  jobData: CreateJobInput
): Promise<SingleResponse<Job>> => {
  const response = await api.post<SingleResponse<Job>>('/jobs', jobData);
  return response.data;
};

export const updateJob = async (
  id: string,
  updateData: UpdateJobInput
): Promise<SingleResponse<Job>> => {
  const response = await api.put<SingleResponse<Job>>(`/jobs/${id}`, updateData);
  return response.data;
};

export const deleteJob = async (
  id: string
): Promise<SingleResponse<{ id: string; title: string }>> => {
  const response = await api.delete<SingleResponse<{ id: string; title: string }>>(`/jobs/${id}`);
  return response.data;
};

// ==========================================
// CANDIDATE APPLICATION SERVICES (/api/candidates)
// ==========================================

export const applyCandidate = async (
  formData: FormData
): Promise<SingleResponse<Candidate>> => {
  // Let browser set the correct multipart boundary automatically
  const response = await api.post<SingleResponse<Candidate>>('/candidates/apply', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getCandidates = async (
  params?: CandidateQueryParams
): Promise<PaginatedResponse<Candidate>> => {
  const response = await api.get<PaginatedResponse<Candidate>>('/candidates', { params });
  return response.data;
};

export const getCandidateById = async (
  id: string
): Promise<SingleResponse<Candidate>> => {
  const response = await api.get<SingleResponse<Candidate>>(`/candidates/${id}`);
  return response.data;
};

export const getCandidatesByJob = async (
  jobId: string,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Candidate>> => {
  const response = await api.get<PaginatedResponse<Candidate>>(`/candidates/job/${jobId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const updateCandidateStatus = async (
  id: string,
  status: ApplicationStatus
): Promise<SingleResponse<Candidate>> => {
  const response = await api.patch<SingleResponse<Candidate>>(`/candidates/${id}/status`, {
    status,
  });
  return response.data;
};

export const updateCandidateNotes = async (
  id: string,
  notes: string
): Promise<SingleResponse<Candidate>> => {
  const response = await api.patch<SingleResponse<Candidate>>(`/candidates/${id}/notes`, {
    notes,
  });
  return response.data;
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
