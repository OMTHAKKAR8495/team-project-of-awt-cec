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
} from 'lucide-react';
import { Job } from '../../types/job';
import { DetailedAnalysisResponse } from '../../types/resume';
import { getJobs, analyzeResume, getErrorMessage } from '../../services/api';
import { Card } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import FileDropzone from '../../components/common/FileDropzone';
import ScoreRing from '../../components/common/ScoreRing';
import AlertBanner from '../../components/common/AlertBanner';

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
        if (preselectedJobId && res.data.some((j: Job) => j._id === preselectedJobId)) {
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

  const handleLoadSampleResume = (type: 'fullstack' | 'data_scientist') => {
    setError(null);
    if (type === 'fullstack') {
      const text = `AARAV SHARMA\nFull Stack Software Engineer | aarav.sharma@example.com | +91 98765 43210\n\nSUMMARY\nPassionate Full Stack Engineer with 3+ years of experience building scalable web applications using React, Node.js, TypeScript, and Cloud Infrastructure (AWS, Docker).\n\nSKILLS\nReact, TypeScript, JavaScript, Node.js, Express, MongoDB, PostgreSQL, REST APIs, GraphQL, Docker, AWS, Git, Tailwind CSS, Jest, CI/CD\n\nEXPERIENCE\nSoftware Developer | NexTech Solutions (2023 - Present)\n- Developed scalable microservices using Node.js & React.\n- Reduced page load latency by 42% through web performance optimization.\n\nEDUCATION\nB.Tech in Computer Science (2019 - 2023)`;
      const sampleFile = new File([text], 'Aarav_Sharma_FullStack_Resume.txt', { type: 'text/plain' });
      setResumeFile(sampleFile);
    } else {
      const text = `PRIYA PATEL\nData Scientist | priya.patel@example.com | +91 98123 45678\n\nSUMMARY\nData Scientist with expertise in Machine Learning, Deep Learning, Natural Language Processing (NLP), Python, and PyTorch.\n\nSKILLS\nPython, PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy, Machine Learning, Deep Learning, NLP, SQL, GCP, FastAPI, Docker\n\nEXPERIENCE\nMachine Learning Engineer | DataGenix AI (2023 - Present)\n- Trained transformer-based NLP models with 94.8% accuracy.\n\nEDUCATION\nM.Tech in AI & Data Science (2019 - 2021)`;
      const sampleFile = new File([text], 'Priya_Patel_DataScientist_Resume.txt', { type: 'text/plain' });
      setResumeFile(sampleFile);
    }
  };

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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>ATS Evaluation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Resume ATS Compatibility Analyzer
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Evaluate how well your resume matches specific role requirements using our deterministic keyword extraction and scoring algorithm. This standalone tool does not save your application.
        </p>
      </div>

      {/* Main Upload Card */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleAnalyze} className="space-y-6">
          {error && (
            <AlertBanner
              variant="error"
              title="Analysis Error"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          {/* Mode Switcher */}
          <div className="flex border-b border-slate-200 gap-6">
            <button
              type="button"
              onClick={() => setMode('job')}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
                mode === 'job'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Evaluate Against Platform Job
            </button>
            <button
              type="button"
              onClick={() => setMode('custom')}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
                mode === 'custom'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Custom Skills & Job Position
            </button>
          </div>

          {/* Mode 1: Job Selector */}
          {mode === 'job' ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Select Target Job Posting <span className="text-rose-500">*</span>
              </label>

              {availableJobs.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={selectedJobId}
                    onChange={e => setSelectedJobId(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none cursor-pointer"
                  >
                    {availableJobs.map(job => (
                      <option key={job._id} value={job._id}>
                        {job.title} — {job.company} ({job.location})
                      </option>
                    ))}
                  </select>

                  {selectedJob && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedJob.company}</span>
                        <span>•</span>
                        <span>{selectedJob.location}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="font-semibold text-slate-700">Required Skills:</span>
                        {selectedJob.requiredSkills.map((sk, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-white text-slate-700 text-[10px] font-medium border border-slate-200"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 space-y-2">
                  <p>No active jobs available in database to match against.</p>
                  <button
                    type="button"
                    onClick={() => setMode('custom')}
                    className="text-indigo-600 font-semibold underline cursor-pointer"
                  >
                    Switch to Custom Skills mode to evaluate any resume
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Custom Requirements */
            <div className="space-y-4">
              <Input
                label="Target Job Title (Optional)"
                placeholder="e.g. Senior Full-Stack Engineer"
                value={customJobTitle}
                onChange={e => setCustomJobTitle(e.target.value)}
              />

              <Input
                label="Required Core Skills (Comma-separated)"
                required
                placeholder="e.g. React, TypeScript, Node.js, Express, MongoDB"
                value={customRequiredSkills}
                onChange={e => setCustomRequiredSkills(e.target.value)}
                hint="These skills are strictly evaluated for ATS matching."
              />

              <Input
                label="Preferred Skills (Optional, comma-separated)"
                placeholder="e.g. Docker, AWS, GraphQL, Redis"
                value={customPreferredSkills}
                onChange={e => setCustomPreferredSkills(e.target.value)}
                hint="Matching preferred skills grants bonus weight to your score."
              />
            </div>
          )}

          {/* Quick Sample Presets from Reference */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              Quick Sample Resumes:
            </span>
            <button
              type="button"
              onClick={() => handleLoadSampleResume('fullstack')}
              className="text-xs px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium border border-indigo-200 transition-colors cursor-pointer"
            >
              Full-Stack Engineer (Aarav)
            </button>
            <button
              type="button"
              onClick={() => handleLoadSampleResume('data_scientist')}
              className="text-xs px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium border border-purple-200 transition-colors cursor-pointer"
            >
              Data Scientist (Priya)
            </button>
          </div>

          {/* Resume Upload Dropzone */}
          <FileDropzone
            label="Upload Resume Document"
            selectedFile={resumeFile}
            onFileSelect={file => setResumeFile(file)}
            disabled={isAnalyzing}
          />

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Deterministic ATS matching based on technical taxonomy.
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isAnalyzing}
              leftIcon={<FileSearch className="w-4 h-4" />}
            >
              Analyze Resume
            </Button>
          </div>
        </form>
      </Card>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Analysis Complete
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Compatibility for {analysisResult.jobInfo.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluated against {analysisResult.jobInfo.requiredSkills.length} required skill(s) and{' '}
                  {analysisResult.jobInfo.preferredSkills.length} preferred skill(s).
                </p>
              </div>

              {/* Score Ring Component */}
              <ScoreRing score={analysisResult.score} size="lg" />
            </div>

            {/* Score Breakdown Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                  Required Skills Coverage
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {analysisResult.breakdown.requiredCoveragePercent}%
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {analysisResult.breakdown.requiredSkillsMatched} of {analysisResult.breakdown.requiredSkillsTotal} matched
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                  Preferred Skills Match
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  {analysisResult.breakdown.preferredSkillsMatched} / {analysisResult.breakdown.preferredSkillsTotal}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Bonus weight added
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                  Total Identified Skills
                </span>
                <span className="text-lg font-bold text-cyan-600">
                  {analysisResult.extractedSkills.length}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  From parsed resume
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                  Deterministic Score
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  {analysisResult.score}/100
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Algorithm output
                </span>
              </div>
            </div>

            {/* Explanation Summary from Backend */}
            {analysisResult.explanation && (
              <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-200/70 space-y-1.5">
                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  ATS Evaluation Rationale
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {analysisResult.explanation}
                </p>
              </div>
            )}

            {/* Skill Taxonomy Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Matched Skills */}
              <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Matched Skills ({analysisResult.matchedSkills.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.matchedSkills.length > 0 ? (
                    analysisResult.matchedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-white text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-2xs"
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
              <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Missing Required Skills ({analysisResult.missingSkills.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.missingSkills.length > 0 ? (
                    analysisResult.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-white text-amber-800 text-xs font-semibold border border-amber-200 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold">
                      Excellent! 100% of required skills were matched.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* All Extracted Skills from Resume */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-800">
                All Recognized Skills Extracted from Your Resume ({analysisResult.extractedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.extractedSkills.length > 0 ? (
                  analysisResult.extractedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white text-slate-700 text-[11px] font-medium border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No recognizable skills parsed.</span>
                )}
              </div>
            </div>

            {/* Academic & Heuristic Disclaimer */}
            <div className="p-3.5 bg-slate-100/70 rounded-lg text-slate-500 text-[11px] flex items-start gap-2 leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Heuristic Disclaimer:</strong> This score represents an automated keyword and taxonomy compatibility estimate. It does not evaluate candidate soft skills, portfolio quality, or human interview performance, and does not constitute a hiring guarantee.
              </span>
            </div>

            {/* Action to Apply If Matching Platform Job */}
            {mode === 'job' && selectedJobId && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Satisfied with your ATS match? Apply for this role now.
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/jobs/${selectedJobId}`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Job & Apply
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzerPage;
