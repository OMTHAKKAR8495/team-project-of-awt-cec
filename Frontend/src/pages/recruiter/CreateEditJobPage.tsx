import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
} from 'lucide-react';
import {
  EmploymentType,
  JobStatus,
  CreateJobInput,
} from '../../types/job';
import {
  createJob,
  updateJob,
  getJobById,
  getErrorMessage,
} from '../../services/api';
import { Card } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import AlertBanner from '../../components/common/AlertBanner';

export const CreateEditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full-time');
  const [status, setStatus] = useState<JobStatus>('open');

  // Skills
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('');
  const [preferredSkillsInput, setPreferredSkillsInput] = useState('');

  // Description & Lists
  const [description, setDescription] = useState('');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');

  // Salary
  const [salaryCurrency, setSalaryCurrency] = useState('USD');
  const [salaryMin, setSalaryMin] = useState<string>('');
  const [salaryMax, setSalaryMax] = useState<string>('');

  // State
  const [isLoadingExisting, setIsLoadingExisting] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Load existing job details in edit mode
  useEffect(() => {
    if (!id) return;

    const loadExistingJob = async () => {
      setIsLoadingExisting(true);
      setServerError(null);

      try {
        const res = await getJobById(id);
        const j = res.data;

        setTitle(j.title || '');
        setCompany(j.company || '');
        setLocation(j.location || '');
        setEmploymentType(j.employmentType || 'full-time');
        setStatus(j.status || 'open');
        setDescription(j.description || '');

        setRequiredSkillsInput(j.requiredSkills ? j.requiredSkills.join(', ') : '');
        setPreferredSkillsInput(j.preferredSkills ? j.preferredSkills.join(', ') : '');

        setResponsibilitiesInput(
          j.responsibilities ? j.responsibilities.join('\n') : ''
        );
        setRequirementsInput(
          j.requirements ? j.requirements.join('\n') : ''
        );

        if (j.salaryRange) {
          setSalaryCurrency(j.salaryRange.currency || 'USD');
          setSalaryMin(j.salaryRange.min !== undefined ? String(j.salaryRange.min) : '');
          setSalaryMax(j.salaryRange.max !== undefined ? String(j.salaryRange.max) : '');
        }
      } catch (err) {
        setServerError(
          getErrorMessage(err, 'Failed to fetch existing job details for editing.')
        );
      } finally {
        setIsLoadingExisting(false);
      }
    };

    loadExistingJob();
  }, [id]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'Job title is required.';
    } else if (title.trim().length < 2) {
      errors.title = 'Job title must be at least 2 characters.';
    } else if (title.trim().length > 150) {
      errors.title = 'Job title cannot exceed 150 characters.';
    }

    if (!company.trim()) {
      errors.company = 'Company name is required.';
    } else if (company.trim().length < 2) {
      errors.company = 'Company name must be at least 2 characters.';
    } else if (company.trim().length > 100) {
      errors.company = 'Company name cannot exceed 100 characters.';
    }

    if (!location.trim()) {
      errors.location = 'Location is required (e.g. Remote, San Francisco, CA).';
    } else if (location.trim().length < 2) {
      errors.location = 'Location must be at least 2 characters.';
    }

    if (!description.trim()) {
      errors.description = 'Job description is required.';
    } else if (description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long.';
    }

    // Required Skills check
    const skills = requiredSkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      errors.requiredSkills = 'At least one required skill must be specified.';
    }

    // Salary validation
    const minVal = salaryMin.trim() ? Number(salaryMin) : undefined;
    const maxVal = salaryMax.trim() ? Number(salaryMax) : undefined;

    if (minVal !== undefined && (isNaN(minVal) || minVal < 0)) {
      errors.salary = 'Minimum salary must be a positive number.';
    }
    if (maxVal !== undefined && (isNaN(maxVal) || maxVal < 0)) {
      errors.salary = 'Maximum salary must be a positive number.';
    }
    if (minVal !== undefined && maxVal !== undefined && minVal > maxVal) {
      errors.salary = 'Minimum salary cannot exceed maximum salary.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Parse arrays
      const requiredSkills = requiredSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const preferredSkills = preferredSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const responsibilities = responsibilitiesInput
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const requirements = requirementsInput
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      // Construct salaryRange if provided
      let salaryRange = undefined;
      const minNum = salaryMin.trim() ? Number(salaryMin) : undefined;
      const maxNum = salaryMax.trim() ? Number(salaryMax) : undefined;
      if (minNum !== undefined || maxNum !== undefined) {
        salaryRange = {
          currency: salaryCurrency.trim().toUpperCase() || 'USD',
          min: minNum,
          max: maxNum,
        };
      }

      const payload: CreateJobInput = {
        title: title.trim(),
        company: company.trim(),
        description: description.trim(),
        location: location.trim(),
        employmentType,
        requiredSkills,
        preferredSkills,
        responsibilities,
        requirements,
        salaryRange,
        status,
      };

      if (isEditMode && id) {
        await updateJob(id, payload);
      } else {
        await createJob(payload);
      }

      // Redirect back to management table on success
      navigate('/recruiter/jobs');
    } catch (err) {
      setServerError(
        getErrorMessage(
          err,
          `Failed to ${isEditMode ? 'update' : 'create'} job posting. Please check all fields.`
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingExisting) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-slate-200 animate-pulse rounded"></div>
        <Card className="p-8 space-y-6">
          <div className="h-8 bg-slate-100 rounded animate-pulse w-1/2"></div>
          <div className="space-y-4">
            <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
            <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
            <div className="h-28 bg-slate-100 rounded animate-pulse"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Job Management
      </Link>

      <Card className="p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isEditMode ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isEditMode
              ? 'Update the specifications and skill requirements for this position.'
              : 'Specify required competencies and role details to start matching resumes.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {serverError && (
            <AlertBanner
              variant="error"
              title="Operation Failed"
              message={serverError}
              onClose={() => setServerError(null)}
            />
          )}

          {/* Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              required
              placeholder="e.g. Senior Frontend Engineer"
              value={title}
              onChange={e => setTitle(e.target.value)}
              error={fieldErrors.title}
              disabled={isSubmitting}
            />

            <Input
              label="Company / Organization"
              required
              placeholder="e.g. Acme Technologies"
              value={company}
              onChange={e => setCompany(e.target.value)}
              error={fieldErrors.company}
              disabled={isSubmitting}
            />
          </div>

          {/* Location, Employment Type, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Location"
              required
              placeholder="e.g. Remote or Austin, TX"
              value={location}
              onChange={e => setLocation(e.target.value)}
              error={fieldErrors.location}
              disabled={isSubmitting}
            />

            <Select
              label="Employment Type"
              required
              value={employmentType}
              onChange={e => setEmploymentType(e.target.value as EmploymentType)}
              disabled={isSubmitting}
              options={[
                { value: 'full-time', label: 'Full-Time' },
                { value: 'part-time', label: 'Part-Time' },
                { value: 'contract', label: 'Contract' },
                { value: 'internship', label: 'Internship' },
                { value: 'remote', label: 'Remote' },
              ]}
            />

            <Select
              label="Recruitment Status"
              required
              value={status}
              onChange={e => setStatus(e.target.value as JobStatus)}
              disabled={isSubmitting}
              options={[
                { value: 'open', label: 'Open (Accepting Applications)' },
                { value: 'closed', label: 'Closed (Paused)' },
              ]}
            />
          </div>

          {/* Salary Range */}
          <div className="space-y-2 p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Compensation / Salary Range (Optional)
              </span>
              <span className="text-[11px] text-slate-400">Min must not exceed Max</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Currency"
                placeholder="USD"
                value={salaryCurrency}
                onChange={e => setSalaryCurrency(e.target.value)}
                disabled={isSubmitting}
              />
              <Input
                label="Minimum"
                type="number"
                placeholder="e.g. 80000"
                value={salaryMin}
                onChange={e => setSalaryMin(e.target.value)}
                disabled={isSubmitting}
              />
              <Input
                label="Maximum"
                type="number"
                placeholder="e.g. 120000"
                value={salaryMax}
                onChange={e => setSalaryMax(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {fieldErrors.salary && (
              <p className="text-xs text-rose-600 font-medium">{fieldErrors.salary}</p>
            )}
          </div>

          {/* Required Skills */}
          <Input
            label="Required Core Skills (Comma-separated)"
            required
            placeholder="e.g. React, TypeScript, Node.js, Express, MongoDB"
            value={requiredSkillsInput}
            onChange={e => setRequiredSkillsInput(e.target.value)}
            error={fieldErrors.requiredSkills}
            hint="These keywords are evaluated directly against candidate resumes by the ATS engine."
            disabled={isSubmitting}
          />

          {/* Preferred Skills */}
          <Input
            label="Preferred Bonus Skills (Comma-separated, optional)"
            placeholder="e.g. Docker, Kubernetes, AWS, Redis, GraphQL"
            value={preferredSkillsInput}
            onChange={e => setPreferredSkillsInput(e.target.value)}
            hint="Extra matching skills provide bonus weight in ATS scoring."
            disabled={isSubmitting}
          />

          {/* Job Description */}
          <Textarea
            label="Job Description"
            required
            placeholder="Provide a comprehensive overview of the position, team, and organizational context..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            error={fieldErrors.description}
            rows={5}
            disabled={isSubmitting}
          />

          {/* Key Responsibilities */}
          <Textarea
            label="Key Responsibilities (One item per line, optional)"
            placeholder="Lead frontend feature architecture&#10;Collaborate with cross-functional product designers&#10;Maintain code quality and automated testing..."
            value={responsibilitiesInput}
            onChange={e => setResponsibilitiesInput(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />

          {/* Requirements & Qualifications */}
          <Textarea
            label="Qualifications & Experience (One item per line, optional)"
            placeholder="3+ years building modern web applications&#10;Proficiency with RESTful API integration&#10;B.S. in Computer Science or equivalent experience..."
            value={requirementsInput}
            onChange={e => setRequirementsInput(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/recruiter/jobs')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isEditMode ? 'Update Position' : 'Publish Position'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateEditJobPage;
