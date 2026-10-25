import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Briefcase,
  Building2,
  MapPin,
  ArrowRight,
  Filter,
  Plus,
  X,
  Target,
  FileSearch,
} from 'lucide-react';
import { Job } from '../../types/job';
import { getJobs, getErrorMessage } from '../../services/api';
import ApplyModal from '../../components/candidate/ApplyModal';

export const JobMatchesPage: React.FC = () => {
  const [candidateSkills, setCandidateSkills] = useState<string[]>([
    'React',
    'TypeScript',
    'Node.js',
    'JavaScript',
    'Tailwind CSS',
    'MongoDB',
    'Git',
  ]);
  const [skillInput, setSkillInput] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  const navigate = useNavigate();

  // Common quick-add skills
  const suggestedSkills = [
    'Python',
    'Docker',
    'Kubernetes',
    'AWS',
    'PostgreSQL',
    'GraphQL',
    'Redis',
    'CI/CD',
    'Linux',
    'Next.js',
    'PyTorch',
  ];

  useEffect(() => {
    const fetchOpenJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getJobs({ limit: 50, status: 'open' });
        setJobs(res.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to fetch active requisitions for matching.'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpenJobs();
  }, []);

  const handleAddSkill = (skill: string) => {
    const normalized = skill.trim();
    if (normalized && !candidateSkills.some(s => s.toLowerCase() === normalized.toLowerCase())) {
      setCandidateSkills([...candidateSkills, normalized]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCandidateSkills(candidateSkills.filter(s => s !== skillToRemove));
  };

  // Compute match score and breakdown for each job
  const matchedJobs = useMemo(() => {
    const candidateSet = new Set(candidateSkills.map(s => s.toLowerCase()));

    return jobs.map(job => {
      const required = job.requiredSkills || [];
      const preferred = job.preferredSkills || [];

      const matchedReq = required.filter(s => candidateSet.has(s.toLowerCase()));
      const missingReq = required.filter(s => !candidateSet.has(s.toLowerCase()));
      const matchedPref = preferred.filter(s => candidateSet.has(s.toLowerCase()));

      let score = 0;
      if (required.length > 0) {
        const reqCoverage = matchedReq.length / required.length;
        const prefCoverage = preferred.length > 0 ? matchedPref.length / preferred.length : 1;
        score = Math.round(reqCoverage * 75 + prefCoverage * 25);
      } else {
        score = 80;
      }

      // Bound score between 10 and 99
      score = Math.min(Math.max(score, 10), 99);

      return {
        job,
        score,
        matchedReq,
        missingReq,
        matchedPref,
      };
    }).sort((a, b) => b.score - a.score);
  }, [jobs, candidateSkills]);

  // Filter by tier
  const filteredMatches = useMemo(() => {
    if (tierFilter === 'high') {
      return matchedJobs.filter(m => m.score >= 80);
    }
    if (tierFilter === 'medium') {
      return matchedJobs.filter(m => m.score >= 60 && m.score < 80);
    }
    return matchedJobs;
  }, [matchedJobs, tierFilter]);

  return (
    <div className="space-y-12 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HERO HEADER */}
      <div className="space-y-4 pt-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/60 border border-indigo-500/40 text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ALGORITHMIC JOB COMPATIBILITY ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Candidate &amp; Requisition Matches
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Configure your professional skill portfolio below. Our engine cross-references live requirements across all 6 enterprise divisions to rank positions by deterministic compatibility score.
        </p>
      </div>

      {/* 2. CANDIDATE SKILLS CONFIGURATION CARD */}
      <div className="nexus-glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/30 bg-[#090d24]/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Your Active Skill Profile ({candidateSkills.length} Skills)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Add or remove skills to observe real-time recalculation of job compatibility.
            </p>
          </div>

          <Link
            to="/analyze-resume"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 hover:bg-cyan-900/60 transition-colors"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Extract Skills from Resume</span>
          </Link>
        </div>

        {/* Selected skills pills */}
        <div className="flex flex-wrap gap-2">
          {candidateSkills.map(skill => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/80 text-cyan-300 border border-indigo-700/50"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-rose-400 p-0.5 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add skill input & suggestions */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddSkill(skillInput);
            }}
            className="flex items-center gap-2 max-w-md"
          >
            <input
              type="text"
              placeholder="Add skill (e.g. AWS, Docker, Python)..."
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              className="w-full bg-[#070a1a] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shrink-0"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Suggestions:</span>
            {suggestedSkills
              .filter(s => !candidateSkills.includes(s))
              .slice(0, 7)
              .map(suggested => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => handleAddSkill(suggested)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] border border-white/5 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{suggested}</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* 3. TIER FILTERS & RESULTS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Filter by Match Tier:
          </span>
          <div className="flex items-center gap-1 bg-[#090d20] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                tierFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Matches ({matchedJobs.length})
            </button>
            <button
              type="button"
              onClick={() => setTierFilter('high')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                tierFilter === 'high' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              High Match &gt;80% ({matchedJobs.filter(m => m.score >= 80).length})
            </button>
            <button
              type="button"
              onClick={() => setTierFilter('medium')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                tierFilter === 'medium' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Moderate 60-79% ({matchedJobs.filter(m => m.score >= 60 && m.score < 80).length})
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredMatches.length}</strong> evaluated opportunities
        </div>
      </div>

      {/* 4. MATCHED JOBS LIST */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="nexus-glass-card rounded-3xl p-12 text-center space-y-4 border border-white/10">
          <Briefcase className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Requisitions</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adding additional skills or adjusting your match tier filter to discover more cross-functional roles.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map(({ job, score, matchedReq, missingReq }) => {
            const isHigh = score >= 80;
            const isMedium = score >= 60 && score < 80;

            return (
              <div
                key={job._id}
                className="nexus-glass-card rounded-2xl p-6 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Job Info & Score */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full border ${
                        isHigh
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                          : isMedium
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                          : 'bg-amber-950/80 text-amber-400 border-amber-500/50'
                      }`}
                    >
                      {score}% Compatibility Match
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                      {job.employmentType}
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="text-lg font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer truncate"
                    >
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        {job.company}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Matched & Missing skills badges */}
                  <div className="space-y-2 pt-1">
                    {matchedReq.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1 mr-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Matched:
                        </span>
                        {matchedReq.map(s => (
                          <span key={s} className="bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {missingReq.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 font-medium mr-1">
                          Missing Requirements:
                        </span>
                        {missingReq.slice(0, 3).map(s => (
                          <span key={s} className="bg-white/5 text-slate-400 border border-white/5 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                        {missingReq.length > 3 && (
                          <span className="text-slate-500">+{missingReq.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForApply(job)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-md shadow-indigo-600/25 transition-all cursor-pointer whitespace-nowrap text-center"
                  >
                    Quick Apply
                  </button>

                  <Link
                    to={`/analyze-resume?jobId=${job._id}`}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-colors whitespace-nowrap"
                  >
                    Full ATS Score
                  </Link>

                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Role</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            setSelectedJobForApply(null);
          }}
        />
      )}
    </div>
  );
};

export default JobMatchesPage;
