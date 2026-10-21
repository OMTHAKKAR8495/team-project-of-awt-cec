import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Building2,
  FileText,
  Save,
  Info,
  RefreshCw,
} from 'lucide-react';
import { Candidate, ApplicationStatus } from '../../types/candidate';
import { Job } from '../../types/job';
import {
  getCandidates,
  getJobs,
  updateCandidateStatus,
  updateCandidateNotes,
  getErrorMessage,
} from '../../services/api';
import { Card } from '../../components/common/Card';
import { ApplicationStatusBadge } from '../../components/common/Badge';
import ScoreRing from '../../components/common/ScoreRing';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import AlertBanner from '../../components/common/AlertBanner';

export const AllCandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [selectedJobFilter, setSelectedJobFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ApplicationStatus | ''>('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Modal Detail State
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [notesUpdating, setNotesUpdating] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [drawerError, setDrawerError] = useState<string | null>(null);

  // Load available jobs for filter dropdown
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await getJobs({ limit: 100 });
        setAvailableJobs(res.data);
      } catch {
        // Safe fallback
      }
    };
    loadJobs();
  }, []);

  const loadCandidates = useCallback(
    async (pageToLoad = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await getCandidates({
          page: pageToLoad,
          limit: 10,
          jobId: selectedJobFilter || undefined,
          status: selectedStatusFilter || undefined,
        });

        setCandidates(res.data);
        setPagination(res.pagination);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to fetch candidate applications.'));
      } finally {
        setIsLoading(false);
      }
    },
    [selectedJobFilter, selectedStatusFilter]
  );

  useEffect(() => {
    loadCandidates(1);
  }, [loadCandidates]);

  const handleOpenModal = (cand: Candidate) => {
    setSelectedCandidate(cand);
    setEditingNotes(cand.notes || '');
    setDrawerError(null);
  };

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!selectedCandidate) return;

    setStatusUpdating(true);
    setDrawerError(null);

    try {
      const res = await updateCandidateStatus(selectedCandidate._id, newStatus);
      setSelectedCandidate(res.data);
      setCandidates(prev =>
        prev.map(c => (c._id === res.data._id ? res.data : c))
      );
      setSuccessNotice(`Updated status for ${selectedCandidate.name} to "${newStatus}".`);
    } catch (err) {
      setDrawerError(getErrorMessage(err, 'Failed to update application status.'));
    } finally {
      setStatusUpdating(false);
    }
  };

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
      setSuccessNotice('Recruiter remarks updated successfully.');
    } catch (err) {
      setDrawerError(getErrorMessage(err, 'Failed to save notes.'));
    } finally {
      setNotesUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Candidate Talent Pool
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter, and review candidate applications across all posted positions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadCandidates(pagination.page)}
          disabled={isLoading}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh
        </Button>
      </div>

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
          title="Candidates Load Error"
          message={error}
          action={{
            label: 'Retry Synchronizing',
            onClick: () => loadCandidates(pagination.page),
          }}
          onClose={() => setError(null)}
        />
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="flex-1">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Filter by Position
          </label>
          <select
            value={selectedJobFilter}
            onChange={e => setSelectedJobFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Posted Positions</option>
            {availableJobs.map(j => (
              <option key={j._id} value={j._id}>
                {j.title} — {j.company}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-56">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Filter by Status
          </label>
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value as ApplicationStatus | '')}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Application Statuses</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>
      </div>

      {/* Candidates Table & Mobile Cards */}
      {isLoading ? (
        <Card className="overflow-hidden">
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </Card>
      ) : candidates.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Candidates Found"
          description={
            selectedJobFilter || selectedStatusFilter
              ? 'No candidate applications match the chosen position or status filters.'
              : 'There are no candidate applications in the platform database yet.'
          }
          actionText={selectedJobFilter || selectedStatusFilter ? 'Clear Filters' : undefined}
          onAction={() => {
            setSelectedJobFilter('');
            setSelectedStatusFilter('');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Position Applied</th>
                  <th className="px-6 py-3.5 text-center">ATS Score</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {candidates.map(cand => (
                  <tr
                    key={cand._id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => handleOpenModal(cand)}
                  >
                    {/* Name & Contact */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{cand.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{cand.email}</div>
                    </td>

                    {/* Job */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {typeof cand.job === 'object' ? cand.job.title : 'Position'}
                      </div>
                      <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{typeof cand.job === 'object' ? cand.job.company : 'Company'}</span>
                      </div>
                    </td>

                    {/* ATS Score */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex">
                        <ScoreRing score={cand.atsScore} size="sm" showLabel={false} />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <ApplicationStatusBadge status={cand.applicationStatus} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(cand.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(cand)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {candidates.map(cand => (
              <div
                key={cand._id}
                onClick={() => handleOpenModal(cand)}
                className="p-4 space-y-2 cursor-pointer hover:bg-slate-50/70"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{cand.name}</h3>
                    <div className="text-xs text-slate-500">{cand.email}</div>
                    <div className="text-xs text-indigo-600 font-medium mt-1">
                      {typeof cand.job === 'object' ? cand.job.title : 'Job'}
                    </div>
                  </div>
                  <ScoreRing score={cand.atsScore} size="sm" showLabel={false} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <ApplicationStatusBadge status={cand.applicationStatus} size="sm" />
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
              onPageChange={newPage => loadCandidates(newPage)}
              disabled={isLoading}
            />
          </div>
        </Card>
      )}

      {/* Candidate Modal / Drawer */}
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

            {/* Position and ATS Score Banner */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Position
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {typeof selectedCandidate.job === 'object'
                    ? `${selectedCandidate.job.title} at ${selectedCandidate.job.company}`
                    : 'Job Application'}
                </h4>
                <p className="text-xs text-slate-500">
                  Applied on {new Date(selectedCandidate.createdAt).toLocaleString()}
                </p>
              </div>
              <ScoreRing score={selectedCandidate.atsScore} size="md" />
            </div>

            {/* Status Change Buttons */}
            <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Update Application Status:
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

            {/* Resume Metadata Notice */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Resume Document: {selectedCandidate.resume.originalName}</span>
              </div>
              <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11px] text-amber-800 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy & Storage Policy:</strong> Binary document files are cleaned up from server disk after text extraction. Extracted skill records and ATS scores are securely preserved.
                </span>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-900 block">
                  Matched Skills ({selectedCandidate.matchedSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.matchedSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white text-emerald-800 text-xs font-semibold border border-emerald-200"
                    >
                      {sk}
                    </span>
                  ))}
                  {selectedCandidate.matchedSkills.length === 0 && (
                    <span className="text-xs text-slate-400 italic">None</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-900 block">
                  Missing Skills ({selectedCandidate.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.missingSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white text-amber-800 text-xs font-semibold border border-amber-200"
                    >
                      {sk}
                    </span>
                  ))}
                  {selectedCandidate.missingSkills.length === 0 && (
                    <span className="text-xs text-emerald-700 font-semibold">None!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Recruiter Notes */}
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
                placeholder="Enter candidate evaluation remarks or interview feedback..."
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

export default AllCandidatesPage;
