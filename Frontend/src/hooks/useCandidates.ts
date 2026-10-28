import { useState, useEffect, useCallback } from 'react';
import { Candidate, CandidateQueryParams } from '../types/candidate';
import { PaginationMeta } from '../types/job';
import { getCandidates, getErrorMessage } from '../services/api';

export interface UseCandidatesReturn {
  candidates: Candidate[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setParams: (params: CandidateQueryParams | ((prev: CandidateQueryParams) => CandidateQueryParams)) => void;
  params: CandidateQueryParams;
}

export const useCandidates = (initialParams: CandidateQueryParams = {}): UseCandidatesReturn => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<CandidateQueryParams>(initialParams);

  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCandidates(params);
      setCandidates(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load candidates.'));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return { candidates, pagination, isLoading, error, refetch: fetchCandidates, setParams, params };
};

