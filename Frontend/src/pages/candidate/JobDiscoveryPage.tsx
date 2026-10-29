import React, { useState, useEffect, useCallback } from 'react';
import { Search, Briefcase, RefreshCw, Sparkles } from 'lucide-react';
import { Job, EmploymentType, JobStatus, PaginationMeta } from '../../types/job';
import { getJobs, getErrorMessage } from '../../services/api';
import JobCard from '../../components/candidate/JobCard';
import ApplyModal from '../../components/candidate/ApplyModal';
import { JobCardSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import AlertBanner from '../../components/common/AlertBanner';

export const JobDiscoveryPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType | ''>('');
  const [status, setStatus] = useState<JobStatus | ''>('open');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected job for ApplyModal
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  const divisionCategories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'software', label: 'Software, Cloud & AI', query: 'Software' },
    { id: 'engineering', label: 'Engineering & Grid', query: 'Engineering' },
    { id: 'finance', label: 'Global Finance & Risk', query: 'Finance' },
    { id: 'health', label: 'Healthcare & Bio', query: 'Health' },
    { id: 'communications', label: 'Brand & Communications', query: 'Communications' },
    { id: 'talent', label: 'HR & Talent Acquisition', query: 'HR' },
  ];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchJobListings = useCallback(
    async (pageToLoad = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = {
          page: pageToLoad,
          limit: 9,
          search: debouncedSearch.trim() || undefined,
          employmentType: employmentType || undefined,
          status: status || undefined,
        };

        const res = await getJobs(queryParams);
        setJobs(res.data);
        setPagination(res.pagination);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to fetch job opportunities.'));
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, employmentType, status]
  );

  useEffect(() => {
    fetchJobListings(1);
  }, [fetchJobListings]);

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setEmploymentType('');
    setStatus('open');
    setSelectedDivision('all');
  };

  const handleDivisionClick = (div: typeof divisionCategories[0]) => {
    setSelectedDivision(div.id);
    if (div.query) {
      setSearch(div.query);
    } else {
      setSearch('');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Hero Header */}
      <div className="space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-cyan-300 border border-indigo-500/40">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>GLOBAL TALENT REQUISITIONS &bull; HIRING ACROSS 65+ COUNTRIES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Enterprise Careers
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Discover verified opportunities across our multidisciplinary divisions. Submit your resume for immediate automated ATS compatibility evaluation.
        </p>
      </div>

      {/* Division Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {divisionCategories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleDivisionClick(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDivision === cat.id
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-indigo-600/25'
                : 'bg-[#0b0f24] text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div className="nexus-glass-card rounded-2xl border border-white/10 p-4 shadow-xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 bg-[#0a0e28]/80">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, department, or required skill (e.g. React, Python, Cloud)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#070916] text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-hidden transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Employment Type Filter */}
        <div className="w-full sm:w-44">
          <select
            value={employmentType}
            onChange={e => setEmploymentType(e.target.value as EmploymentType | '')}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#070916] text-slate-200 focus:border-cyan-400 focus:outline-hidden transition-colors cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-36">
          <select
            value={status}
            onChange={e => setStatus(e.target.value as JobStatus | '')}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-white/10 bg-[#070916] text-slate-200 focus:border-cyan-400 focus:outline-hidden transition-colors cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="open">Open Only</option>
            <option value="closed">Closed Only</option>
          </select>
        </div>

        {/* Clear Filters / Refresh */}
        <Button
          variant="outline"
          size="md"
          onClick={() => fetchJobListings(pagination.page)}
          disabled={isLoading}
          aria-label="Refresh listings"
          leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh
        </Button>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{jobs.length}</strong> of{' '}
          <strong className="text-white">{pagination.total}</strong> active opportunities
        </span>
        {(search || employmentType || status !== 'open' || selectedDivision !== 'all') && (
          <button
            onClick={handleResetFilters}
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <AlertBanner
          variant="error"
          title="Listing Error"
          message={error}
          action={{
            label: 'Retry Loading Jobs',
            onClick: () => fetchJobListings(pagination.page),
          }}
        />
      )}

      {/* Job Grid / Skeletons / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : !error && jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Job Postings Found"
          description={
            search || employmentType || status
              ? "We couldn't find any job postings matching your current search criteria. Try adjusting your filters or search keywords."
              : 'There are currently no active job postings in the database. Recruiter accounts can create the first position from the recruiter portal.'
          }
          actionText={
            search || employmentType || status ? 'Clear Filters' : undefined
          }
          onAction={handleResetFilters}
        />
      ) : !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map(job => (
            <JobCard
              key={job._id}
              job={job}
              onApplyClick={j => setSelectedJobForApply(j)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && jobs.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={newPage => fetchJobListings(newPage)}
          disabled={isLoading}
        />
      )}

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
      />
    </div>
  );
};

export default JobDiscoveryPage;
