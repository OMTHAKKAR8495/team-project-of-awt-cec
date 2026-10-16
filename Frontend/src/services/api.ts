import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Resolve API base URL from environment or fallback to standard local port
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

/**
 * Reusable, centralized Axios instance configured for the application.
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for future authentication tokens
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

export default api;
