import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Building2, MapPin } from 'lucide-react';
import { Job } from '../../types/job';
import { Candidate } from '../../types/candidate';
import { applyCandidate, getErrorMessage } from '../../services/api';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import FileDropzone from '../common/FileDropzone';
import ScoreRing from '../common/ScoreRing';
import AlertBanner from '../common/AlertBanner';

export interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (candidate: Candidate) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] = useState<Candidate | null>(null);

  if (!job) return null;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (phone && phone.trim().length > 25) {
      errors.phone = 'Phone number is too long (max 25 characters).';
    }

    if (notes && notes.length > 2000) {
      errors.notes = 'Notes cannot exceed 2000 characters.';
    }

    if (!resumeFile) {
      errors.resume = 'Resume file (.pdf, .docx, or .txt) is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate() || !resumeFile) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('name', name.trim());
      formData.append('email', email.trim().toLowerCase());
      if (phone.trim()) formData.append('phone', phone.trim());
      formData.append('jobId', job._id);
      if (notes.trim()) formData.append('notes', notes.trim());

      const res = await applyCandidate(formData);
      setSubmittedCandidate(res.data);

      // Save to candidate local session history
      try {
        const stored = sessionStorage.getItem('candidate_applications');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          jobId: job._id,
          jobTitle: job.title,
          company: job.company,
          atsScore: res.data.atsScore,
          applicationStatus: res.data.applicationStatus,
          appliedAt: new Date().toISOString(),
        });
        sessionStorage.setItem('candidate_applications', JSON.stringify(list));
      } catch {
        // Safe fallback if sessionStorage is blocked
      }

      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Failed to submit application.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (!isSubmitting) {
      setSubmittedCandidate(null);
      setSubmitError(null);
      setFieldErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      size="lg"
      title={
        submittedCandidate ? (
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <span>Application Submitted Successfully</span>
          </div>
        ) : (
          `Apply for ${job.title}`
        )
      }
      description={
        submittedCandidate
          ? `Your application has been received and evaluated by the ATS matching engine.`
          : `${job.company} • ${job.location}`
      }
    >
      {submittedCandidate ? (
        /* Post-Submission ATS Results Summary */
        <div className="space-y-6 py-2">
          <div className="p-5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row items-center gap-5">
            <ScoreRing score={submittedCandidate.atsScore} size="md" />
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-900 text-sm">
                ATS Compatibility Score: {submittedCandidate.atsScore}%
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Resume parsed automatically for {job.title}. Your application profile has been registered in the recruiter review queue with status{' '}
                <span className="font-semibold capitalize text-emerald-800">
                  {submittedCandidate.applicationStatus}
                </span>.
              </p>
              <p className="text-[11px] text-slate-400">
                Application Reference ID: <code className="font-mono">{submittedCandidate._id}</code>
              </p>
            </div>
          </div>

          {/* Matched & Missing Skills breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-emerald-700 block mb-2">
                ✓ Matched Skills ({submittedCandidate.matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {submittedCandidate.matchedSkills.length > 0 ? (
                  submittedCandidate.matchedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 text-[11px] font-medium border border-emerald-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">None detected</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-amber-700 block mb-2">
                ! Skills to Enhance ({submittedCandidate.missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {submittedCandidate.missingSkills.length > 0 ? (
                  submittedCandidate.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-800 text-[11px] font-medium border border-amber-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">All required skills matched!</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleModalClose();
                navigate('/applications');
              }}
            >
              View My Applications
            </Button>
            <Button variant="primary" size="sm" onClick={handleModalClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        /* Application Submission Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <AlertBanner
              variant="error"
              title="Submission Failed"
              message={submitError}
              onClose={() => setSubmitError(null)}
            />
          )}

          {/* Job Context Header Pill */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{job.title}</span>
              <span>at {job.company}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              error={fieldErrors.name}
              disabled={isSubmitting}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. jane@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={fieldErrors.email}
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            placeholder="e.g. +1 (555) 000-0000 (optional)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            error={fieldErrors.phone}
            disabled={isSubmitting}
          />

          <FileDropzone
            label="Upload Resume Document"
            selectedFile={resumeFile}
            onFileSelect={file => {
              setResumeFile(file);
              if (file) {
                setFieldErrors(prev => ({ ...prev, resume: '' }));
              }
            }}
            error={fieldErrors.resume}
            disabled={isSubmitting}
          />

          <Textarea
            label="Cover Notes / Candidate Remarks"
            placeholder="Briefly describe your experience or highlight relevant achievements (optional)..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            error={fieldErrors.notes}
            hint="Maximum 2000 characters."
            disabled={isSubmitting}
            rows={3}
          />

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleModalClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Submit Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ApplyModal;
