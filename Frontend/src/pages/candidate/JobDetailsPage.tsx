import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Banknote,
  Sparkles,
  FileSearch,
  CheckCircle2,
} from 'lucide-react';
import { Job } from '../../types/job';
import { getJobById, getErrorMessage } from '../../services/api';
import { Card } from '../../components/common/Card';
import { JobStatusBadge, EmploymentTypeBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ApplyModal from '../../components/candidate/ApplyModal';
import Skeleton from '../../components/common/LoadingSkeleton';
import AlertBanner from '../../components/common/AlertBanner';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getJobById(id);
        setJob(res.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Could not retrieve job details. The job may not exist or has been removed.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-6 w-32 bg-slate-200 animate-pulse rounded"></div>
        <Card className="p-8 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 py-8">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all opportunities
        </Link>
        <AlertBanner
          variant="error"
          title="Job Listing Unavailable"
          message={error || 'The requested job posting could not be located.'}
          action={{
            label: 'Browse Active Jobs',
            onClick: () => navigate('/jobs'),
          }}
        />
      </div>
    );
  }

  const formattedCreated = new Date(job.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const salaryText = job.salaryRange
    ? job.salaryRange.min && job.salaryRange.max
      ? `${job.salaryRange.currency || 'USD'} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
      : job.salaryRange.min
        ? `From ${job.salaryRange.currency || 'USD'} ${job.salaryRange.min.toLocaleString()}`
        : job.salaryRange.max
          ? `Up to ${job.salaryRange.currency || 'USD'} ${job.salaryRange.max.toLocaleString()}`
          : null
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all opportunities
      </Link>

      {/* Main Job Card Header */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <EmploymentTypeBadge type={job.employmentType} size="md" />
              <JobStatusBadge status={job.status} size="md" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Building2 className="w-4 h-4 text-slate-400" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                Posted {formattedCreated}
              </span>
            </div>
          </div>

          {/* Quick Apply Button on Desktop */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            {job.status === 'open' ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsApplyModalOpen(true)}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Apply for this Role
              </Button>
            ) : (
              <div className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200">
                Applications Closed
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/analyze-resume?jobId=${job._id}`)}
              leftIcon={<FileSearch className="w-3.5 h-3.5" />}
            >
              Analyze Resume ATS
            </Button>
          </div>
        </div>

        {/* Salary & Overview Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-slate-100 bg-slate-50/50 -mx-6 sm:-mx-8 px-6 sm:px-8">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Remuneration
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Banknote className="w-4 h-4 text-emerald-600" />
              {salaryText || 'Competitive / Experience-based'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Employment Type
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 capitalize mt-0.5 block">
              {job.employmentType}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Job Status
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 capitalize mt-0.5 block">
              {job.status === 'open' ? 'Active Recruitment' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Closed warning banner */}
        {job.status === 'closed' && (
          <div className="my-6">
            <AlertBanner
              variant="warning"
              title="Position Closed"
              message="This opening is currently closed. New candidate applications are not being accepted at this time."
            />
          </div>
        )}

        {/* Job Body Sections */}
        <div className="pt-6 space-y-8">
          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              About the Role
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Required Core Skills</span>
              <span className="text-xs font-normal text-rose-500">*ATS Evaluated</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          {job.preferredSkills && job.preferredSkills.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Preferred & Bonus Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.preferredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Key Responsibilities
              </h2>
              <ul className="space-y-2 text-sm text-slate-600">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements / Qualifications */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Candidate Requirements & Qualifications
              </h2>
              <ul className="space-y-2 text-sm text-slate-600">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Ready to apply? Upload your resume to evaluate keyword compatibility.</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => navigate(`/analyze-resume?jobId=${job._id}`)}
              leftIcon={<FileSearch className="w-4 h-4" />}
            >
              Analyze Resume
            </Button>
            {job.status === 'open' && (
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
                onClick={() => setIsApplyModalOpen(true)}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};

export default JobDetailsPage;
