import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Calendar,
  Banknote,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Job } from '../../types/job';
import { Card } from '../common/Card';
import { JobStatusBadge, EmploymentTypeBadge } from '../common/Badge';
import Button from '../common/Button';

export interface JobCardProps {
  job: Job;
  onApplyClick?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApplyClick }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(job.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const salaryDisplay = job.salaryRange
    ? job.salaryRange.min && job.salaryRange.max
      ? `${job.salaryRange.currency || 'USD'} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
      : job.salaryRange.min
        ? `From ${job.salaryRange.currency || 'USD'} ${job.salaryRange.min.toLocaleString()}`
        : job.salaryRange.max
          ? `Up to ${job.salaryRange.currency || 'USD'} ${job.salaryRange.max.toLocaleString()}`
          : null
    : null;

  return (
    <Card hoverable className="p-6 flex flex-col justify-between">
      <div>
        {/* Top Header: Company, Location, Badges */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer truncate"
              title={job.title}
            >
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedDate}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <EmploymentTypeBadge type={job.employmentType} />
            <JobStatusBadge status={job.status} />
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 my-3 leading-relaxed">
          {job.description}
        </p>

        {/* Required Skills Chips */}
        <div className="flex flex-wrap items-center gap-1.5 my-3">
          {job.requiredSkills.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/80"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 5 && (
            <span className="text-[11px] text-slate-400 font-medium">
              +{job.requiredSkills.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Footer: Salary & Actions */}
      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          {salaryDisplay ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <Banknote className="w-3.5 h-3.5" />
              {salaryDisplay}
            </span>
          ) : (
            <span className="text-xs text-slate-400">Competitive salary</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/jobs/${job._id}`)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Details
          </Button>

          {job.status === 'open' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => (onApplyClick ? onApplyClick(job) : navigate(`/jobs/${job._id}`))}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Apply
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
