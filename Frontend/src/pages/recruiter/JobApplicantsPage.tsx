import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Filter,
  FileText,
  Save,
  Info,
  RefreshCw,
} from 'lucide-react';
import { Candidate, ApplicationStatus } from '../../types/candidate';
import { Job } from '../../types/job';
import {
  getCandidatesByJob,
  getJobById,
  updateCandidateStatus,
  updateCandidateNotes,
  getErrorMessage,
} from '../../services/api';
import { Card } from '../../components/common/Card';
import { ApplicationStatusBadge, JobStatusBadge } from '../../components/common/Badge';
import ScoreRing from '../../components/common/ScoreRing';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import AlertBanner from '../../components/common/AlertBanner';

export const JobApplicantsPage: React.FC = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Candidate Detail Drawer / Modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [notesUpdating, setNotesUpdating] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [drawerError, setDrawerError] = useState<string | null>(null);

  // Fetch job specifications and applicants
  const loadApplicants = useCallback(
    async (pageToLoad = 1) => {
      if (!jobId) return;

      setIsLoading(true);
      setError(null);

      try {
        const [jobRes, candidatesRes] = await Promise.all([
          getJobById(jobId),
          getCandidatesByJob(jobId, pageToLoad, 20),
        ]);

        setJob(jobRes.data);
        setCandidates(candidatesRes.data);
        setPagination(candidatesRes.pagination);
      } catch (err) {
        setError(getErrorMessage(err, 'Could not retrieve applicants for this position.'));
      } finally {
        setIsLoading(false);
      }
    },
    [jobId]
  );

  useEffect(() => {
    loadApplicants(1);
  }, [loadApplicants]);

  // Open applicant detail modal
  const handleOpenCandidateModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setEditingNotes(candidate.notes || '');
    setDrawerError(null);
  };

  // Change candidate application status
  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!selectedCandidate) return;

    setStatusUpdating(true);
    setDrawerError(null);

    try {
      const res = await updateCandidateStatus(selectedCandidate._id, newStatus);
      // Update selected modal candidate
      setSelectedCandidate(res.data);
      // Update in table list
      setCandidates(prev =>
        prev.map(c => (c._id === res.data._id ? res.data : c))
      );
      setActionSuccessNotice(
        `Application status for ${selectedCandidate.name} updated to "${newStatus}".`
      );
    } catch (err) {
      setDrawerError(
        getErrorMessage(err, 'Failed to update candidate status on server.')
      );
    } finally {
      setStatusUpdating(false);
    }
  };

  // Save recruiter notes
  const handleSaveNotes = async () => {
    if (!selectedCandidate) return;

    setNotesUpdating(true);
    setDrawerError(null);

    try {
      const res = await updateCandidateNotes(selectedCandidate._id, editingNotes.trim());
      setSelectedCandidate(res.data);
      setCandidates(prev =>
        prev.map(c => (c._id === res.data._id ? res.data : c))
      );
      setActionSuccessNotice('Recruiter notes updated successfully.');
    } catch (err) {
      setDrawerError(
        getErrorMessage(err, 'Failed to save notes on server.')
      );
    } finally {
      setNotesUpdating(false);
    }
  };

  // Filter candidates client-side if status filter selected
  const displayedCandidates = statusFilter
    ? candidates.filter(c => c.applicationStatus === statusFilter)
    : candidates;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Job Management
      </Link>

      {/* Job Context Header Card */}
      {job && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <JobStatusBadge status={job.status} size="sm" />
                <span className="text-xs text-slate-500 font-medium">
                  {job.company} • {job.location}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {job.title} — Candidate Applications
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Target Core Skills:</span>
                {job.requiredSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadApplicants(pagination.page)}
                disabled={isLoading}
                leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                Public Listing
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Success Notification */}
      {actionSuccessNotice && (
        <AlertBanner
          variant="success"
          message={actionSuccessNotice}
          onClose={() => setActionSuccessNotice(null)}
        />
      )}

      {error && (
        <AlertBanner
          variant="error"
          title="Applicants Load Error"
          message={error}
          action={{
            label: 'Retry Loading',
            onClick: () => loadApplicants(pagination.page),
          }}
          onClose={() => setError(null)}
        />
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filter by Application Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ApplicationStatus | '')}
            className="py-1 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Applications ({candidates.length})</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Ranked deterministically by <strong>ATS Compatibility Score</strong>
        </span>
      </div>

      {/* Applicants List / Table */}
      {isLoading ? (
        <Card className="overflow-hidden">
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </Card>
      ) : displayedCandidates.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Candidates Found"
          description={
            statusFilter
              ? `No applicants with status "${statusFilter}" were found for this position.`
              : 'No candidates have submitted applications for this job opening yet. Applications submitted through the candidate portal will be ranked here.'
          }
          actionText={statusFilter ? 'Clear Filter' : undefined}
          onAction={() => setStatusFilter('')}
        />
      ) : (
        <Card className="overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Candidate Name & Contact</th>
                  <th className="px-6 py-3.5 text-center">ATS Rating</th>
                  <th className="px-6 py-3.5">Matched Skills</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {displayedCandidates.map(candidate => (
                  <tr
                    key={candidate._id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => handleOpenCandidateModal(candidate)}
                  >
                    {/* Candidate Name & Email */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{candidate.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{candidate.email}</div>
                      {candidate.phone && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{candidate.phone}</div>
                      )}
                    </td>

                    {/* ATS Score */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex">
                        <ScoreRing score={candidate.atsScore} size="sm" showLabel={false} />
                      </div>
                    </td>

                    {/* Matched Skills */}
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {candidate.matchedSkills.slice(0, 3).map((sk, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200"
                          >
                            {sk}
                          </span>
                        ))}
                        {candidate.matchedSkills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{candidate.matchedSkills.length - 3}
                          </span>
                        )}
                        {candidate.matchedSkills.length === 0 && (
                          <span className="text-[10px] text-slate-400 italic">None</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <ApplicationStatusBadge status={candidate.applicationStatus} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenCandidateModal(candidate)}
                      >
                        Review Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {displayedCandidates.map(candidate => (
              <div
                key={candidate._id}
                onClick={() => handleOpenCandidateModal(candidate)}
                className="p-4 space-y-3 cursor-pointer hover:bg-slate-50/70"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{candidate.name}</h3>
                    <div className="text-xs text-slate-500">{candidate.email}</div>
                  </div>
                  <ScoreRing score={candidate.atsScore} size="sm" showLabel={false} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <ApplicationStatusBadge status={candidate.applicationStatus} size="sm" />
                  <Button variant="ghost" size="sm">
                    Review Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 px-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={newPage => loadApplicants(newPage)}
              disabled={isLoading}
            />
          </div>
        </Card>
      )}

      {/* Applicant Detail Review Modal / Drawer */}
      {selectedCandidate && (
        <Modal
          isOpen={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          size="lg"
          title={
            <div className="flex items-center gap-3">
              <span>{selectedCandidate.name}</span>
              <ApplicationStatusBadge
                status={selectedCandidate.applicationStatus}
                size="md"
              />
            </div>
          }
          description={`${selectedCandidate.email} ${selectedCandidate.phone ? `• ${selectedCandidate.phone}` : ''}`}
        >
          <div className="space-y-6">
            {drawerError && (
              <AlertBanner
                variant="error"
                message={drawerError}
                onClose={() => setDrawerError(null)}
              />
            )}

            {/* ATS Score Header Banner */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Automated Match Rating
                </span>
                <h4 className="text-lg font-bold text-slate-900">
                  ATS Score: {selectedCandidate.atsScore}%
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Evaluated against job requirements using deterministic keyword parsing.
                </p>
              </div>
              <ScoreRing score={selectedCandidate.atsScore} size="md" />
            </div>

            {/* Status Change Buttons */}
            <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Update Candidate Application Status:
              </span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCandidate.applicationStatus === 'pending' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('pending')}
                  disabled={statusUpdating}
                >
                  Pending
                </Button>
                <Button
                  variant={selectedCandidate.applicationStatus === 'shortlisted' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('shortlisted')}
                  disabled={statusUpdating}
                >
                  Shortlist
                </Button>
                <Button
                  variant={selectedCandidate.applicationStatus === 'hired' ? 'success' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('hired')}
                  disabled={statusUpdating}
                >
                  Hire
                </Button>
                <Button
                  variant={selectedCandidate.applicationStatus === 'rejected' ? 'danger' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('rejected')}
                  disabled={statusUpdating}
                >
                  Reject
                </Button>
              </div>
            </div>

            {/* Resume Metadata & Retention Notice */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Uploaded Resume Document</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[11px]">Filename</span>
                  <span className="font-mono">{selectedCandidate.resume.originalName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">File Size & Date</span>
                  <span>
                    {(selectedCandidate.resume.fileSize / 1024).toFixed(1)} KB •{' '}
                    {new Date(selectedCandidate.resume.uploadedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11px] text-amber-800 flex items-start gap-2 mt-2">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy & Disk Storage Policy:</strong> Resume binary files are cleaned up from server disk immediately following text extraction to protect candidate confidentiality. Extracted skill entities and parsing scores are securely retained.
                </span>
              </div>
            </div>

            {/* Skills Taxonomy Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-900 block">
                  Matched Skills ({selectedCandidate.matchedSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.matchedSkills.length > 0 ? (
                    selectedCandidate.matchedSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white text-emerald-800 text-xs font-semibold border border-emerald-200"
                      >
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">None matched</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-900 block">
                  Missing Skills ({selectedCandidate.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.missingSkills.length > 0 ? (
                    selectedCandidate.missingSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white text-amber-800 text-xs font-semibold border border-amber-200"
                      >
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold">
                      Full match!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Recruiter Notes Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Recruiter Screening Notes
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveNotes}
                  isLoading={notesUpdating}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Notes
                </Button>
              </div>
              <Textarea
                placeholder="Enter internal recruiter notes or interview evaluation remarks..."
                value={editingNotes}
                onChange={e => setEditingNotes(e.target.value)}
                rows={3}
                disabled={notesUpdating}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default JobApplicantsPage;
