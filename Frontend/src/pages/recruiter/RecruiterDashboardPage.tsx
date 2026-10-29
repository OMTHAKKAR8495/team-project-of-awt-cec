import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { Job } from '../../types/job';
import { Candidate } from '../../types/candidate';
import { getJobs, getCandidates, getErrorMessage } from '../../services/api';
import { Card } from '../../components/common/Card';
import { JobStatusBadge, ApplicationStatusBadge } from '../../components/common/Badge';
import ScoreRing from '../../components/common/ScoreRing';
import Button from '../../components/common/Button';
import { StatCardSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import AlertBanner from '../../components/common/AlertBanner';

export const RecruiterDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch jobs and candidates concurrently using real backend list endpoints
      const [jobsRes, candidatesRes] = await Promise.all([
        getJobs({ limit: 100 }),
        getCandidates({ limit: 100 }),
      ]);

      setJobs(jobsRes.data);
      setTotalJobs(jobsRes.pagination.total);

      setCandidates(candidatesRes.data);
      setTotalCandidates(candidatesRes.pagination.total);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not fetch recruiter analytics and data from backend.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute metrics from real API data
  const openJobsCount = jobs.filter(j => j.status === 'open').length;
  const closedJobsCount = jobs.filter(j => j.status === 'closed').length;

  const avgAtsScore =
    candidates.length > 0
      ? Math.round(candidates.reduce((acc, c) => acc + c.atsScore, 0) / candidates.length)
      : 0;

  const shortlistedCount = candidates.filter(
    c => c.applicationStatus === 'shortlisted' || c.applicationStatus === 'hired'
  ).length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Recruiter Operations Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recruitment Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time pipeline metrics, ATS qualification distributions, and applicant screening workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
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
            Post New Job
          </Button>
        </div>
      </div>

      {error && (
        <AlertBanner
          variant="error"
          title="Dashboard Sync Notice"
          message={error}
          action={{
            label: 'Retry Synchronizing',
            onClick: loadDashboardData,
          }}
        />
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            {/* Total Jobs */}
            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Positions</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{totalJobs}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="text-emerald-600 font-semibold">{openJobsCount} Open</span>
                <span>•</span>
                <span className="text-slate-400">{closedJobsCount} Closed</span>
              </div>
            </Card>

            {/* Total Applicants */}
            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Applicants</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{totalCandidates}</div>
              <div className="text-xs text-slate-500">
                Across all registered postings
              </div>
            </Card>

            {/* Average ATS Score */}
            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Avg ATS Compatibility</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-600">
                {avgAtsScore > 0 ? `${avgAtsScore}%` : 'N/A'}
              </div>
              <div className="text-xs text-slate-500">
                Deterministic algorithmic rating
              </div>
            </Card>

            {/* Shortlisted / Hired */}
            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Qualified Candidates</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{shortlistedCount}</div>
              <div className="text-xs text-slate-500">
                Status: Shortlisted or Hired
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Main Grid: Recent Job Postings & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Job Postings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Recent Job Postings</span>
            </h2>
            <Link
              to="/recruiter/jobs"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage all ({totalJobs})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No Jobs Created Yet"
              description="Get started by posting your first engineering role on the recruitment platform."
              actionText="Post First Job"
              onAction={() => navigate('/recruiter/jobs/new')}
            />
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map(job => (
                <Card
                  key={job._id}
                  hoverable
                  onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {job.title}
                      </h3>
                      <JobStatusBadge status={job.status} size="sm" />
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/recruiter/jobs/${job._id}/applicants`);
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Applicants
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications Pipeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Recent Applicant Activity</span>
            </h2>
            <Link
              to="/recruiter/candidates"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>View all ({totalCandidates})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Applicants Yet"
              description="Candidates who submit applications will automatically appear here ranked by their ATS compatibility."
            />
          ) : (
            <div className="space-y-3">
              {candidates.slice(0, 5).map(candidate => (
                <Card
                  key={candidate._id}
                  hoverable
                  onClick={() => navigate('/recruiter/candidates')}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {candidate.name}
                      </h3>
                      <ApplicationStatusBadge
                        status={candidate.applicationStatus}
                        size="sm"
                      />
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {typeof candidate.job === 'object'
                        ? `${candidate.job.title} at ${candidate.job.company}`
                        : 'Applied Position'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <ScoreRing score={candidate.atsScore} size="sm" showLabel={false} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        navigate('/recruiter/candidates');
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Review
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
