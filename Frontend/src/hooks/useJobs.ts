import { useState, useEffect, useCallback } from 'react';
import { Job, JobQueryParams, PaginationMeta } from '../types/job';
import { getJobs, getErrorMessage } from '../services/api';

export interface UseJobsReturn {
  jobs: Job[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setParams: (params: JobQueryParams | ((prev: JobQueryParams) => JobQueryParams)) => void;
  params: JobQueryParams;
}

export const useJobs = (initialParams: JobQueryParams = {}): UseJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<JobQueryParams>(initialParams);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getJobs(params);
      setJobs(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load jobs.'));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, pagination, isLoading, error, refetch: fetchJobs, setParams, params };
};

