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
  TrendingUp,
  LayoutList,
  Compass,
  FileCheck,
  History,
  Clock,
  Trash2,
  Eye,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { Job } from '../../types/job';
import { DetailedAnalysisResponse } from '../../types/resume';
import {
  getJobs,
  analyzeResume,
  getErrorMessage,
  getResumeAnalysisHistory,
  deleteResumeAnalysis,
  clearResumeAnalysisHistory,
} from '../../services/api';
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

  // Mode: 'general' (general resume quality audit) vs 'job' (evaluate against specific job) vs 'custom' (evaluate against custom skills)
  const [mode, setMode] = useState<'general' | 'job' | 'custom'>(preselectedJobId ? 'job' : 'general');

  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(preselectedJobId);
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [customRequiredSkills, setCustomRequiredSkills] = useState('');
  const [customPreferredSkills, setCustomPreferredSkills] = useState('');

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DetailedAnalysisResponse | null>(null);

  // Past ATS evaluations persisted in database
  const [analysisHistory, setAnalysisHistory] = useState<DetailedAnalysisResponse[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await getResumeAnalysisHistory(25);
      if (res?.data) {
        setAnalysisHistory(res.data);
      }
    } catch {
      // Non-blocking if database/history is unavailable
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDeleteHistoryItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteResumeAnalysis(id);
      setAnalysisHistory(prev => prev.filter(item => (item.id || item._id) !== id));
    } catch (err) {
      console.error('Failed to delete resume history item:', err);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your ATS evaluation history?')) {
      return;
    }
    try {
      await clearResumeAnalysisHistory();
      setAnalysisHistory([]);
    } catch (err) {
      console.error('Failed to clear resume history:', err);
    }
  };

  const handleSelectHistoryItem = (item: DetailedAnalysisResponse) => {
    setAnalysisResult(item);
    setTimeout(() => {
      const el = document.getElementById('analysis-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 480, behavior: 'smooth' });
      }
    }, 100);
  };

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

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
        // Database may be offline or no jobs yet; custom & general modes remain accessible
      }
    };
    loadJobs();
  }, [preselectedJobId]);

  const handleLoadSampleResume = (type: 'fullstack' | 'data_scientist' | 'cloud') => {
    setError(null);
    if (type === 'fullstack') {
      const text = `AARAV SHARMA
Full Stack Software Engineer | aarav.sharma@example.com | +91 98765 43210 | github.com/aaravsharma | linkedin.com/in/aaravsharma

PROFESSIONAL SUMMARY
Passionate Full Stack Engineer with 4+ years of experience architecting and building high-throughput web applications using React, Node.js, TypeScript, and Cloud Infrastructure (AWS, Docker).

SKILLS & COMPETENCIES
React, TypeScript, JavaScript, Node.js, Express, MongoDB, PostgreSQL, REST APIs, GraphQL, Docker, AWS, Git, Tailwind CSS, Jest, CI/CD, Redis, Microservices

WORK EXPERIENCE
Senior Software Engineer | NexTech Global Solutions (2022 - Present)
- Architected and delivered responsive micro-frontend applications with React and TypeScript, scaling to over 150,000+ daily active users.
- Optimized REST API query throughput in Node.js & PostgreSQL, reducing 95th percentile latency by 45%.
- Implemented automated CI/CD pipelines using GitHub Actions and Docker, reducing deployment cycle times by 60%.

Software Developer | Quantum Cloud Works (2020 - 2022)
- Built 15+ secure RESTful services using Express and MongoDB.
- Collaborated with UX designers to develop reusable component libraries with Tailwind CSS.

KEY PROJECTS
OpenSource Workflow Engine | GitHub
- Developed a distributed task pipeline in Go and TypeScript with 1,200+ stars on GitHub.

EDUCATION
B.Tech in Computer Science & Engineering | Tech University (2016 - 2020)
GPA: 3.8 / 4.0`;
      const sampleFile = new File([text], 'Aarav_Sharma_FullStack_Resume.txt', { type: 'text/plain' });
      setResumeFile(sampleFile);
    } else if (type === 'data_scientist') {
      const text = `PRIYA PATEL
Data Scientist & AI Researcher | priya.patel@example.com | +91 98123 45678 | linkedin.com/in/priyapatel | github.com/priyapatel

PROFESSIONAL SUMMARY
Data Scientist with 3+ years of expertise in Machine Learning, Deep Learning, Natural Language Processing (NLP), and Python. Proven track record of operationalizing predictive models that increased customer retention by 28%.

TECHNICAL SKILLS
Python, PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy, Machine Learning, Deep Learning, NLP, SQL, GCP, FastAPI, Docker, Git, Data Analysis, Statistics

WORK EXPERIENCE
Senior Machine Learning Engineer | DataGenix AI Labs (2022 - Present)
- Trained and fine-tuned transformer-based NLP models with 94.8% accuracy for multi-class entity classification.
- Reduced inference latency by 35% using ONNX runtime and Docker containerization on GCP.
- Mentored junior engineers and led bi-weekly research paper reading groups.

Data Scientist | Alpha Analytics (2020 - 2022)
- Built customer churn prediction models using XGBoost, saving $240,000 annually.
- Authored automated SQL and Pandas feature engineering pipelines.

EDUCATION
M.Tech in Artificial Intelligence & Data Science | Indian Institute of Technology (2018 - 2020)
B.E. in Information Technology (2014 - 2018)`;
      const sampleFile = new File([text], 'Priya_Patel_DataScientist_Resume.txt', { type: 'text/plain' });
      setResumeFile(sampleFile);
    } else {
      const text = `VIKRAM MALHOTRA
Cloud Infrastructure & DevOps Architect | vikram.m@example.com | +1 415-555-0182 | github.com/vikramm | linkedin.com/in/vikramm

PROFESSIONAL SUMMARY
Senior Cloud & DevOps Architect with 6+ years of expertise in Kubernetes, AWS, Terraform, and high-availability distributed systems.

CORE COMPETENCIES
Kubernetes, Docker, Terraform, AWS, Azure, CI/CD, Linux, Python, Go, Helm, Ansible, Prometheus, Grafana, Microservices, Git, System Design

PROFESSIONAL EXPERIENCE
Lead Cloud Architect | Stratos Cloud Systems (2021 - Present)
- Designed and deployed multi-region AWS EKS clusters hosting 200+ containerized microservices.
- Automated 100% of infrastructure provisioning using Terraform and GitHub Actions.
- Reduced cloud compute infrastructure spend by $180,000 annually through dynamic autoscaling and spot instances.

DevOps Engineer | CloudGrid Networks (2018 - 2021)
- Managed Prometheus and Grafana monitoring stacks maintaining 99.99% system uptime SLA.

EDUCATION
B.S. in Computer Engineering | State University (2014 - 2018)`;
      const sampleFile = new File([text], 'Vikram_Malhotra_CloudDevOps_Resume.txt', { type: 'text/plain' });
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
      formData.append('mode', mode);

      if (mode === 'job') {
        formData.append('jobId', selectedJobId);
        const currentTargetJob = availableJobs.find(j => j._id === selectedJobId);
        if (currentTargetJob) {
          formData.append('jobTitle', currentTargetJob.title);
          formData.append('requiredSkills', JSON.stringify(currentTargetJob.requiredSkills));
          if (currentTargetJob.preferredSkills && currentTargetJob.preferredSkills.length > 0) {
            formData.append('preferredSkills', JSON.stringify(currentTargetJob.preferredSkills));
          }
        }
      } else if (mode === 'custom') {
        formData.append('jobTitle', customJobTitle.trim() || 'Custom Job Position');
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
      setAnalysisHistory(prev => {
        const currentId = res.data.id || res.data._id;
        const filtered = prev.filter(item => (item.id || item._id) !== currentId);
        return [res.data, ...filtered];
      });

      // Smooth scroll down to results
      setTimeout(() => {
        const el = document.getElementById('analysis-results');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({
            top: 480,
            behavior: 'smooth',
          });
        }
      }, 150);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to analyze resume. Please verify the file and parameters.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectedJob = availableJobs.find(j => j._id === selectedJobId);

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-indigo-500/40">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
          <span>ATS Evaluation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Resume ATS Compatibility & Quality Analyzer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Check your overall general resume score, or evaluate compatibility against specific enterprise roles using deterministic keyword extraction and structural ATS audit algorithms.
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
          <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => {
                setMode('general');
                setAnalysisResult(null);
              }}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
                mode === 'general'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>General Resume Score</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                Any Resume
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('job');
                setAnalysisResult(null);
              }}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
                mode === 'job'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Evaluate Against Platform Job</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('custom');
                setAnalysisResult(null);
              }}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
                mode === 'custom'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Custom Skills & Job Position</span>
            </button>
          </div>

          {/* Mode 1: General Score Mode Description */}
          {mode === 'general' && (
            <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/80 dark:border-indigo-800/40 space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>General Resume Quality & ATS Readiness Audit</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload your resume to evaluate overall ATS compliance, document structure, detected sections (Education, Experience, Skills), action verb intensity, quantifiable achievements, and contact channels. No target job required.
              </p>
            </div>
          )}

          {/* Mode 2: Job Selector */}
          {mode === 'job' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Target Job Posting <span className="text-rose-500">*</span>
              </label>

              {availableJobs.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={selectedJobId}
                    onChange={e => setSelectedJobId(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none cursor-pointer"
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
                    onClick={() => setMode('general')}
                    className="text-indigo-600 font-semibold underline cursor-pointer"
                  >
                    Switch to General Resume Score mode to evaluate any resume
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Custom Requirements */}
          {mode === 'custom' && (
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

          {/* Quick Sample Presets */}
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
            <button
              type="button"
              onClick={() => handleLoadSampleResume('cloud')}
              className="text-xs px-2.5 py-1 rounded-md bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-medium border border-cyan-200 transition-colors cursor-pointer"
            >
              Cloud & DevOps (Vikram)
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
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              {mode === 'general'
                ? 'Comprehensive audit of formatting, skill breadth, metrics, and action verbs.'
                : 'Deterministic ATS matching based on technical taxonomy.'}
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isAnalyzing}
              leftIcon={<FileSearch className="w-4 h-4" />}
            >
              {mode === 'general' ? 'Check General Resume Score' : 'Analyze Resume Match'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div id="analysis-results" className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {analysisResult.generalBreakdown || analysisResult.mode === 'general'
                    ? 'General ATS Audit Complete'
                    : 'Role Compatibility Analysis Complete'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {analysisResult.generalBreakdown || analysisResult.mode === 'general'
                    ? 'General Resume Quality & ATS Readiness'
                    : `Compatibility for ${analysisResult.jobInfo.title}`}
                </h3>
                <p className="text-xs text-slate-500">
                  {analysisResult.generalBreakdown || analysisResult.mode === 'general'
                    ? `Evaluated across Structure (25%), Skill Breadth (30%), Impact Verbs (25%), and Contact Completeness (20%). Word count: ${analysisResult.generalBreakdown?.wordCount ?? 'N/A'}.`
                    : `Evaluated against ${analysisResult.jobInfo.requiredSkills.length} required skill(s) and ${analysisResult.jobInfo.preferredSkills.length} preferred skill(s).`}
                </p>
              </div>

              {/* Score Ring Component */}
              <ScoreRing score={analysisResult.score} size="lg" />
            </div>

            {/* General Mode 4-Pillar Score Breakdown */}
            {analysisResult.generalBreakdown ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Structure & Layout
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {analysisResult.generalBreakdown.structureScore}/25
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {analysisResult.generalBreakdown.sectionsDetected.length} sections found
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Skill Breadth
                  </span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {analysisResult.generalBreakdown.skillsScore}/30
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {analysisResult.extractedSkills.length} skills identified
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Impact & Verbs
                  </span>
                  <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                    {analysisResult.generalBreakdown.impactScore}/25
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {analysisResult.generalBreakdown.actionVerbsCount} action verbs
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Contact Channels
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {analysisResult.generalBreakdown.completenessScore}/20
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Profiles & links verified
                  </span>
                </div>
              </div>
            ) : (
              /* Role-Specific Mode Score Breakdown */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Required Skills Coverage
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {analysisResult.breakdown.requiredCoveragePercent}%
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {analysisResult.breakdown.requiredSkillsMatched} of {analysisResult.breakdown.requiredSkillsTotal} matched
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Preferred Skills Match
                  </span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {analysisResult.breakdown.preferredSkillsMatched} / {analysisResult.breakdown.preferredSkillsTotal}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Bonus weight added
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Total Identified Skills
                  </span>
                  <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                    {analysisResult.extractedSkills.length}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    From parsed resume
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Deterministic Score
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {analysisResult.score}/100
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Algorithm output
                  </span>
                </div>
              </div>
            )}

            {/* Explanation Summary */}
            {analysisResult.explanation && (
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200/70 space-y-1.5">
                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  ATS Evaluation Rationale
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {analysisResult.explanation}
                </p>
              </div>
            )}

            {/* General Mode Strengths & Recommendations */}
            {analysisResult.strengths && analysisResult.strengths.length > 0 && (
              <div className="p-5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-3">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Resume Strengths ({analysisResult.strengths.length})
                </h4>
                <ul className="space-y-2">
                  {analysisResult.strengths.map((str, i) => (
                    <li key={i} className="text-xs text-emerald-900 flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div className="p-5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Actionable Recommendations to Improve Score
                </h4>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-amber-950 flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detected Sections in General Mode */}
            {analysisResult.generalBreakdown && (
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <LayoutList className="w-4 h-4 text-slate-500" />
                  Standard ATS Sections Audit
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.generalBreakdown.sectionsDetected.map((sec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-white text-emerald-800 text-xs font-medium border border-emerald-200 flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {sec}
                    </span>
                  ))}
                  {analysisResult.generalBreakdown.missingSections.map((sec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200/70 flex items-center gap-1 line-through"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Role-Specific Matched & Missing Skills */}
            {!analysisResult.generalBreakdown && (
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
            )}

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
                <strong>Heuristic Disclaimer:</strong> This score represents an automated keyword and structural compatibility audit. It evaluates format readability, vocabulary breadth, and industry criteria. It does not replace human evaluation or interview assessments.
              </span>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-600">
                {analysisResult.generalBreakdown || analysisResult.mode === 'general'
                  ? 'Ready to find matching enterprise openings based on your skills?'
                  : 'Satisfied with your ATS match? Apply for this role now.'}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  analysisResult.jobInfo?.id
                    ? navigate(`/jobs/${analysisResult.jobInfo.id}`)
                    : navigate('/jobs')
                }
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {analysisResult.jobInfo?.id ? 'View Job & Apply' : 'Explore Matching Jobs'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Persisted History Panel */}
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800/60">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Evaluation History & Past ATS Audits
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {analysisHistory.length} saved
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Past evaluations saved to database with scores, skill matches, and recommendations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadHistory}
              isLoading={isLoadingHistory}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Refresh
            </Button>
            {analysisHistory.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/40"
              >
                Clear History
              </Button>
            )}
          </div>
        </div>

        {analysisHistory.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No previous evaluations found
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Any resume you analyze in General, Platform Job, or Custom mode will automatically be saved to your history for instant review.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {analysisHistory.map((item, index) => {
              const itemId = item.id || item._id || String(index);
              const isSelected =
                analysisResult &&
                ((analysisResult.id && analysisResult.id === item.id) ||
                  (analysisResult._id && analysisResult._id === item._id));

              const isGeneral = item.mode === 'general' || Boolean(item.generalBreakdown);
              const title = isGeneral
                ? 'General Resume Quality Audit'
                : item.jobInfo?.title || 'Target Role Analysis';

              const scoreColor =
                item.score >= 75
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60'
                  : item.score >= 50
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60';

              return (
                <div
                  key={itemId}
                  onClick={() => handleSelectHistoryItem(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-600/70 shadow-xs'
                      : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 mt-0.5 sm:mt-0">
                      <FileText className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[260px] sm:max-w-md">
                          {item.resumeName || 'Resume Document'}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isGeneral
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                              : 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
                          }`}
                        >
                          {isGeneral ? 'General Audit' : 'Role Match'}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-cyan-300 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                          {title}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatTimestamp(item.createdAt)}
                        </span>
                        <span>•</span>
                        <span>
                          {item.extractedSkills?.length ?? 0} skills detected
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div
                      className={`px-3 py-1 rounded-lg border font-bold text-sm flex items-center gap-1.5 ${scoreColor}`}
                    >
                      <span className="text-xs font-normal">ATS Score:</span>
                      <span>{item.score}%</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleSelectHistoryItem(item);
                        }}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        Inspect
                      </Button>
                      <button
                        type="button"
                        title="Delete evaluation record"
                        onClick={e => handleDeleteHistoryItem(e, itemId)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResumeAnalyzerPage;
