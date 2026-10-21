import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  Building2,
  ShieldAlert,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { Candidate, ApplicationStatus } from '../../types/candidate';
import { getCandidateById, getErrorMessage } from '../../services/api';
import { Card } from '../../components/common/Card';
import { ApplicationStatusBadge } from '../../components/common/Badge';
import ScoreRing from '../../components/common/ScoreRing';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import EmptyState from '../../components/common/EmptyState';
import AlertBanner from '../../components/common/AlertBanner';

interface SessionApplication {
  _id: string;
  name: string;
  email: string;
  jobId: string;
  jobTitle: string;
  company: string;
  atsScore: number;
  applicationStatus: ApplicationStatus;
  appliedAt: string;
}

export const CandidateApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionApps, setSessionApps] = useState<SessionApplication[]>([]);
  const [lookupId, setLookupId] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupResult, setLookupResult] = useState<Candidate | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Load applications submitted during this browser session
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('candidate_applications');
      if (stored) {
        setSessionApps(JSON.parse(stored));
      }
    } catch {
      setSessionApps([]);
    }
  }, []);

  const handleClearHistory = () => {
    try {
      sessionStorage.removeItem('candidate_applications');
      setSessionApps([]);
    } catch {
      // safe fallback
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);

    const cleanId = lookupId.trim();
    if (!cleanId) {
      setLookupError('Please enter a 24-character Application Reference ID.');
      return;
    }

    setIsLookingUp(true);
    try {
      const res = await getCandidateById(cleanId);
      setLookupResult(res.data);
    } catch (err) {
      setLookupError(getErrorMessage(err, 'No application found with the provided Reference ID.'));
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />
          <span>Application Status Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Candidate Application History
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Monitor your submitted applications and track recruiter review progress across active positions.
        </p>
      </div>

      {/* Honest Architectural Boundary Notice */}
      <div className="p-4 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-slate-800">
            Phase 2 Session Architecture Notice
          </h4>
          <p className="leading-relaxed text-[11px] text-slate-500">
            This deployment operates without candidate account logins or JWT sessions. The cards below display applications submitted during your current browser session. You can also look up any verified application live from the backend using its Reference ID.
          </p>
        </div>
      </div>

      {/* Lookup by Application Reference ID */}
      <Card className="p-5 sm:p-6">
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Direct Application Status Lookup
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your 24-character MongoDB Application ID to query live status from the database.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Paste Application Reference ID (e.g. 65db4f1...)"
                value={lookupId}
                onChange={e => setLookupId(e.target.value)}
                disabled={isLookingUp}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLookingUp}
              leftIcon={<Search className="w-4 h-4" />}
            >
              Check Status
            </Button>
          </div>

          {lookupError && (
            <AlertBanner
              variant="error"
              message={lookupError}
              onClose={() => setLookupError(null)}
            />
          )}

          {/* Lookup Result Card */}
          {lookupResult && (
            <div className="p-5 bg-indigo-50/40 rounded-xl border border-indigo-200/80 space-y-4 mt-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider block">
                    Verified Application
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    {lookupResult.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {typeof lookupResult.job === 'object'
                      ? `${lookupResult.job.title} at ${lookupResult.job.company}`
                      : 'Position details'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ScoreRing score={lookupResult.atsScore} size="sm" showLabel={false} />
                  <ApplicationStatusBadge status={lookupResult.applicationStatus} size="md" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-indigo-100 pt-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Applied Date</span>
                  <span className="font-medium text-slate-700">
                    {new Date(lookupResult.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Candidate Contact</span>
                  <span className="font-medium text-slate-700">
                    {lookupResult.email} {lookupResult.phone ? `• ${lookupResult.phone}` : ''}
                  </span>
                </div>
              </div>

              {lookupResult.notes && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700 block mb-1">
                    Candidate Note:
                  </span>
                  {lookupResult.notes}
                </div>
              )}
            </div>
          )}
        </form>
      </Card>

      {/* Session Applications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Recent Applications in This Browser Session ({sessionApps.length})
          </h2>
          {sessionApps.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear local history
            </button>
          )}
        </div>

        {sessionApps.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No Applications Recorded Yet"
            description="You have not submitted any job applications during this browser session. Browse available positions to apply and see your ATS evaluation."
            actionText="Browse Available Jobs"
            onAction={() => navigate('/jobs')}
          />
        ) : (
          <div className="space-y-3">
            {sessionApps.map((app, index) => (
              <Card key={index} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {app.jobTitle}
                    </h3>
                    <ApplicationStatusBadge
                      status={app.applicationStatus}
                      size="sm"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.company}
                    </span>
                    <span>•</span>
                    <span>Applicant: {app.name}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">ID: {app._id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <ScoreRing score={app.atsScore} size="sm" showLabel={false} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLookupId(app._id);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Check Status
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateApplicationsPage;
