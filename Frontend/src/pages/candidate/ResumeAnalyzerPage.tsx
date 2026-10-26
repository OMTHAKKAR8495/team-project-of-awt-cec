import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileSearch,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building2,
  Info,
  ArrowRight,
  Shield,
  BarChart3,
  Target,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';
import { Job } from '../../types/job';
import { DetailedAnalysisResponse } from '../../types/resume';
import { getJobs, analyzeResume, getErrorMessage } from '../../services/api';
import FileDropzone from '../../components/common/FileDropzone';
import ScoreRing from '../../components/common/ScoreRing';

export const ResumeAnalyzerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedJobId = searchParams.get('jobId') || '';

  // Mode: 'job' (evaluate against existing job) vs 'custom' (evaluate against custom skills)
  const [mode, setMode] = useState<'job' | 'custom'>(preselectedJobId ? 'job' : 'job');

  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(preselectedJobId);
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [customRequiredSkills, setCustomRequiredSkills] = useState('');
  const [customPreferredSkills, setCustomPreferredSkills] = useState('');

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DetailedAnalysisResponse | null>(null);

  // Fetch available jobs for dropdown
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await getJobs({ limit: 50, status: 'open' });
        setAvailableJobs(res.data);
        if (preselectedJobId && res.data.some(j => j._id === preselectedJobId)) {
          setSelectedJobId(preselectedJobId);
        } else if (res.data.length > 0) {
          setSelectedJobId(prev => prev || res.data[0]._id);
        }
      } catch {
        // Database may be offline or no jobs yet; custom mode remains accessible
      }
    };
    loadJobs();
  }, [preselectedJobId]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeFile) {
      setError('Please select or drag-and-drop a resume document (.pdf, .docx, or .txt).');
      return;
    }

    if (mode === 'job' && !selectedJobId) {
      setError('Please select a job position to match your resume against.');
      return;
    }

    if (mode === 'custom' && !customRequiredSkills.trim()) {
      setError('Please specify at least one required skill (e.g. React, Node.js, TypeScript).');
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      if (mode === 'job') {
        formData.append('jobId', selectedJobId);
      } else {
        formData.append('jobTitle', customJobTitle.trim() || 'Custom Job Position');
        // Split comma-separated skills
        const reqSkills = customRequiredSkills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        formData.append('requiredSkills', JSON.stringify(reqSkills));

        if (customPreferredSkills.trim()) {
          const prefSkills = customPreferredSkills
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
          formData.append('preferredSkills', JSON.stringify(prefSkills));
        }
      }

      const res = await analyzeResume(formData);
      setAnalysisResult(res.data);

      // Smooth scroll down to results
      setTimeout(() => {
        window.scrollTo({
          top: 450,
          behavior: 'smooth',
        });
      }, 150);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to analyze resume. Please verify the file and requirements.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectedJob = availableJobs.find(j => j._id === selectedJobId);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* ───────── HERO SECTION ───────── */}
      <section className="relative pt-10 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Subtle radial glow behind hero */}
        <div className="absolute inset-0 -top-20 pointer-events-none" aria-hidden="true">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-indigo-600/10 via-purple-600/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/60 border border-indigo-500/40 text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ATS EVALUATION ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Resume ATS{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Compatibility Analyzer
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Evaluate how well your resume matches specific role requirements using our deterministic keyword
            extraction and scoring algorithm. This standalone tool does not save your application.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            {
              icon: Shield,
              title: 'Privacy-First',
              desc: 'Your resume is processed in-memory and never stored.',
            },
            {
              icon: Cpu,
              title: 'Deterministic Engine',
              desc: 'Rule-based taxonomy matching, no opaque AI scoring.',
            },
            {
              icon: Zap,
              title: 'Instant Analysis',
              desc: 'Results delivered in under 3 seconds, every time.',
            },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="nexus-glass-card rounded-2xl p-5 border border-white/10 space-y-2 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-white text-sm">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────── MAIN UPLOAD CARD ───────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="nexus-glass-card rounded-3xl p-6 sm:p-10 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-slate-900/50">
          <form onSubmit={handleAnalyze} className="space-y-8">
            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/30 flex items-start gap-3" role="alert">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-rose-300 mb-0.5">Analysis Error</h4>
                  <p className="text-xs text-rose-200/80 leading-relaxed">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="p-1 text-rose-400 hover:text-rose-200 rounded-md cursor-pointer"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-white/10 gap-6">
              <button
                type="button"
                onClick={() => setMode('job')}
                className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
                  mode === 'job'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Evaluate Against Platform Job
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode('custom')}
                className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
                  mode === 'custom'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Custom Skills &amp; Job Position
                </span>
              </button>
            </div>

            {/* Mode 1: Job Selector */}
            {mode === 'job' ? (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Target Job Posting <span className="text-rose-400">*</span>
                </label>

                {availableJobs.length > 0 ? (
                  <div className="space-y-3">
                    <select
                      value={selectedJobId}
                      onChange={e => setSelectedJobId(e.target.value)}
                      className="w-full py-3 px-4 text-sm rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none cursor-pointer backdrop-blur-sm appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25rem',
                      }}
                    >
                      {availableJobs.map(job => (
                        <option key={job._id} value={job._id} className="bg-slate-900 text-white">
                          {job.title} — {job.company} ({job.location})
                        </option>
                      ))}
                    </select>

                    {selectedJob && (
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          <Building2 className="w-4 h-4 text-cyan-400" />
                          <span>{selectedJob.company}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{selectedJob.location}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-xs font-semibold text-slate-400">Required:</span>
                          {selectedJob.requiredSkills.map((sk, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 text-[11px] font-medium border border-indigo-500/30"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 bg-white/5 rounded-xl border border-white/10 text-sm text-slate-400 space-y-3">
                    <p>No active jobs available in database to match against.</p>
                    <button
                      type="button"
                      onClick={() => setMode('custom')}
                      className="text-cyan-400 font-semibold hover:text-cyan-300 underline cursor-pointer transition-colors"
                    >
                      Switch to Custom Skills mode to evaluate any resume →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Mode 2: Custom Requirements */
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Target Job Title <span className="text-slate-500 text-[10px] font-normal normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Full-Stack Engineer"
                    value={customJobTitle}
                    onChange={e => setCustomJobTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Required Core Skills <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React, TypeScript, Node.js, Express, MongoDB"
                    value={customRequiredSkills}
                    onChange={e => setCustomRequiredSkills(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 backdrop-blur-sm"
                  />
                  <p className="text-[11px] text-slate-500">Comma-separated. These skills are strictly evaluated for ATS matching.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Preferred Skills <span className="text-slate-500 text-[10px] font-normal normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Docker, AWS, GraphQL, Redis"
                    value={customPreferredSkills}
                    onChange={e => setCustomPreferredSkills(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 backdrop-blur-sm"
                  />
                  <p className="text-[11px] text-slate-500">Comma-separated. Matching preferred skills grants bonus weight to your score.</p>
                </div>
              </div>
            )}

            {/* Resume Upload Dropzone */}
            <FileDropzone
              label="Upload Resume Document"
              selectedFile={resumeFile}
              onFileSelect={file => setResumeFile(file)}
              disabled={isAnalyzing}
            />

            {/* Submit Action */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                Deterministic ATS matching based on technical taxonomy.
              </span>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/25 transition-all flex items-center gap-2.5 shrink-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                    </svg>
                    <span>Analyzing…</span>
                  </>
                ) : (
                  <>
                    <FileSearch className="w-4 h-4" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ───────── ANALYSIS RESULTS ───────── */}
      {analysisResult && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Results Header Card */}
          <div className="nexus-glass-card rounded-3xl p-6 sm:p-10 border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-slate-900/50 space-y-8">
            {/* Title + Score */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pb-8 border-b border-white/10">
              <div className="space-y-3 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-950/50 border border-emerald-500/40 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Analysis Complete
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Compatibility for{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {analysisResult.jobInfo.title}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Evaluated against {analysisResult.jobInfo.requiredSkills.length} required skill(s) and{' '}
                  {analysisResult.jobInfo.preferredSkills.length} preferred skill(s).
                </p>
              </div>

              {/* Score Ring */}
              <div className="shrink-0">
                <ScoreRing score={analysisResult.score} size="lg" />
              </div>
            </div>

            {/* Score Breakdown Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: 'Required Coverage',
                  value: `${analysisResult.breakdown.requiredCoveragePercent}%`,
                  sub: `${analysisResult.breakdown.requiredSkillsMatched} of ${analysisResult.breakdown.requiredSkillsTotal} matched`,
                  color: 'text-white',
                },
                {
                  label: 'Preferred Match',
                  value: `${analysisResult.breakdown.preferredSkillsMatched} / ${analysisResult.breakdown.preferredSkillsTotal}`,
                  sub: 'Bonus weight added',
                  color: 'text-indigo-300',
                },
                {
                  label: 'Identified Skills',
                  value: String(analysisResult.extractedSkills.length),
                  sub: 'From parsed resume',
                  color: 'text-cyan-300',
                },
                {
                  label: 'Deterministic Score',
                  value: `${analysisResult.score}/100`,
                  sub: 'Algorithm output',
                  color: 'text-emerald-300',
                },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  className="nexus-glass-card rounded-2xl p-4 border border-white/10 text-center space-y-1"
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {metric.label}
                  </span>
                  <span className={`text-xl font-extrabold ${metric.color} block`}>
                    {metric.value}
                  </span>
                  <span className="text-[11px] text-slate-500 block">{metric.sub}</span>
                </div>
              ))}
            </div>

            {/* ATS Evaluation Rationale */}
            {analysisResult.explanation && (
              <div className="p-5 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 space-y-2">
                <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  ATS Evaluation Rationale
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {analysisResult.explanation}
                </p>
              </div>
            )}

            {/* Skill Taxonomy Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Matched Skills */}
              <div className="rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/20 space-y-3">
                <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Matched Skills ({analysisResult.matchedSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.matchedSkills.length > 0 ? (
                    analysisResult.matchedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/50 text-emerald-200 text-xs font-semibold border border-emerald-500/30"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      No required skills were matched in the resume text.
                    </span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="rounded-2xl p-5 border border-amber-500/30 bg-amber-950/20 space-y-3">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Missing Required Skills ({analysisResult.missingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingSkills.length > 0 ? (
                    analysisResult.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-amber-950/50 text-amber-200 text-xs font-semibold border border-amber-500/30"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-300 font-semibold">
                      ✓ Excellent! 100% of required skills were matched.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* All Extracted Skills */}
            <div className="nexus-glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                All Recognized Skills Extracted ({analysisResult.extractedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.extractedSkills.length > 0 ? (
                  analysisResult.extractedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 text-[11px] font-medium border border-white/10"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No recognizable skills parsed.</span>
                )}
              </div>
            </div>

            {/* Heuristic Disclaimer */}
            <div className="p-4 bg-white/3 rounded-xl border border-white/8 text-slate-500 text-[11px] flex items-start gap-3 leading-relaxed">
              <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-400">Heuristic Disclaimer:</strong> This score represents an automated keyword and taxonomy compatibility estimate.
                It does not evaluate candidate soft skills, portfolio quality, or human interview performance, and does not constitute a hiring guarantee.
              </span>
            </div>

            {/* Action to Apply */}
            {mode === 'job' && selectedJobId && (
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-slate-400">
                  Satisfied with your ATS match? Apply for this role now.
                </span>
                <button
                  onClick={() => navigate(`/jobs/${selectedJobId}`)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>View Job &amp; Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResumeAnalyzerPage;
