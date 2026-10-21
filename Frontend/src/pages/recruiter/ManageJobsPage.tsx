import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Users,
  RefreshCw,
  Building2,
  MapPin,
} from 'lucide-react';
import { Job, EmploymentType, JobStatus, PaginationMeta } from '../../types/job';
import { getJobs, deleteJob, getErrorMessage } from '../../services/api';
import { Card } from '../../components/common/Card';
import { JobStatusBadge, EmploymentTypeBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import AlertBanner from '../../components/common/AlertBanner';

export const ManageJobsPage: React.FC = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<JobStatus | ''>('');
  const [employmentType, setEmploymentType] = useState<EmploymentType | ''>('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Job deletion state
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadJobs = useCallback(
    async (pageToLoad = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await getJobs({
          page: pageToLoad,
          limit: 10,
          search: debouncedSearch.trim() || undefined,
          status: status || undefined,
          employmentType: employmentType || undefined,
        });

        setJobs(res.data);
        setPagination(res.pagination);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to retrieve jobs list from server.'));
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, status, employmentType]
  );

  useEffect(() => {
    loadJobs(1);
  }, [loadJobs]);

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    setIsDeleting(true);
    setError(null);
    setSuccessNotice(null);

    try {
      await deleteJob(jobToDelete._id);
      setSuccessNotice(`Job posting "${jobToDelete.title}" was deleted successfully.`);
      setJobToDelete(null);
      // Refresh list from server
      await loadJobs(pagination.page);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete job posting. Operation was cancelled.'));
      setJobToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Job Postings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, update, and manage your organization's open technical vacancies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadJobs(pagination.page)}
            disabled={isLoading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/recruiter/jobs/new')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create New Job
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successNotice && (
        <AlertBanner
          variant="success"
          message={successNotice}
          onClose={() => setSuccessNotice(null)}
        />
      )}

      {error && (
        <AlertBanner
          variant="error"
          title="Management Error"
          message={error}
          action={{
            label: 'Retry Loading',
            onClick: () => loadJobs(pagination.page),
          }}
          onClose={() => setError(null)}
        />
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, company, or skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-40">
          <select
            value={status}
            onChange={e => setStatus(e.target.value as JobStatus | '')}
            className="w-full py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="w-full sm:w-44">
          <select
            value={employmentType}
            onChange={e => setEmploymentType(e.target.value as EmploymentType | '')}
            className="w-full py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Employment Types</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Desktop Table & Mobile Cards */}
      {isLoading ? (
        <Card className="overflow-hidden">
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </Card>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Job Postings Found"
          description={
            search || status || employmentType
              ? 'No jobs match your filter criteria. Try clearing your filters to see all openings.'
              : 'You have not created any job listings yet. Create a new posting to begin accepting candidate applications.'
          }
          actionText={search || status || employmentType ? 'Clear Filters' : 'Create Job'}
          onAction={() => {
            if (search || status || employmentType) {
              setSearch('');
              setStatus('');
              setEmploymentType('');
            } else {
              navigate('/recruiter/jobs/new');
            }
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Position & Organization</th>
                  <th className="px-6 py-3.5">Location & Type</th>
                  <th className="px-6 py-3.5">Key Skills</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date Created</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {jobs.map(job => (
                  <tr key={job._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Position */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{job.title}</div>
                      <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.company}</span>
                      </div>
                    </td>

                    {/* Location & Type */}
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="mt-1">
                        <EmploymentTypeBadge type={job.employmentType} size="sm" />
                      </div>
                    </td>

                    {/* Skills */}
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {job.requiredSkills.slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                        {job.requiredSkills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{job.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <JobStatusBadge status={job.status} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                          title="View Applicants for this Job"
                          leftIcon={<Users className="w-3.5 h-3.5 text-indigo-600" />}
                        >
                          Applicants
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}
                          title="Edit Job"
                          leftIcon={<Edit2 className="w-3.5 h-3.5 text-slate-500" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setJobToDelete(job)}
                          title="Delete Job"
                          className="hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {jobs.map(job => (
              <div key={job._id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <JobStatusBadge status={job.status} size="sm" />
                </div>

                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                    leftIcon={<Users className="w-3.5 h-3.5" />}
                  >
                    Applicants
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setJobToDelete(job)}
                      className="hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer / Pagination */}
          <div className="border-t border-slate-100 px-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={newPage => loadJobs(newPage)}
              disabled={isLoading}
            />
          </div>
        </Card>
      )}

      {/* Confirmation Dialog for Job Deletion */}
      <ConfirmDialog
        isOpen={Boolean(jobToDelete)}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Posting?"
        message={`Are you sure you want to delete the job posting for "${jobToDelete?.title}" at ${jobToDelete?.company}? This will permanently remove the listing from candidate discovery. This action cannot be undone.`}
        confirmText="Delete Job"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ManageJobsPage;
