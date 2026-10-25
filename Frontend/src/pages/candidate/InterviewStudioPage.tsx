import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Briefcase,
  Lightbulb,
  Copy,
  Check,
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  category: string;
  expectedKeyPoints: string[];
  sampleModelAnswer: string;
}

export const InterviewStudioPage: React.FC = () => {
  // Stages: 'setup' | 'active' | 'completed'
  const [stage, setStage] = useState<'setup' | 'active' | 'completed'>('setup');
  const [selectedTrack, setSelectedTrack] = useState('fullstack');
  const [difficulty, setDifficulty] = useState('senior');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyBenchmark = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const interviewTracks = [
    {
      id: 'fullstack',
      title: 'Full-Stack & Cloud Architecture',
      subtitle: 'React 19, TypeScript, Node.js, Distributed Microservices & Docker',
      questions: [
        {
          id: 1,
          category: 'Concurrency & Event Loop',
          question: 'Explain how Node.js processes asynchronous operations via the libuv Event Loop and what happens when CPU-bound tasks block the main thread.',
          expectedKeyPoints: ['Event loop phases (timers, poll, check)', 'Worker threads or cluster module', 'Thread pool delegation for file/crypto operations'],
          sampleModelAnswer: 'Node.js utilizes a single-threaded JavaScript execution context backed by libuv for asynchronous I/O. CPU-intensive operations block the poll phase, starving other events; mitigating this requires Worker Threads or microservice partitioning.',
        },
        {
          id: 2,
          category: 'State Management & Performance',
          question: 'How do you optimize re-renders in complex React client hierarchies handling high-frequency telemetry data streams?',
          expectedKeyPoints: ['Memoization (useMemo, useCallback)', 'State localization', 'Throttling/debouncing WebSocket payloads', 'Virtualization (react-window)'],
          sampleModelAnswer: 'Isolate high-frequency state away from the parent tree, leverage lightweight state primitives, debounce stream buffers, and use DOM list virtualization for rendering lists of 1,000+ items.',
        },
        {
          id: 3,
          category: 'Distributed Security & Zero Trust',
          question: 'How do you design an ephemeral resume upload pipeline that prevents arbitrary code execution and memory leak vulnerabilities?',
          expectedKeyPoints: ['MIME and magic byte validation', 'Strict size and buffer limits', 'Sandboxed in-memory parsing with guaranteed finally block cleanup', 'Rate limiting and virus scanning'],
          sampleModelAnswer: 'Enforce binary file header inspection (%PDF- magic bytes), isolate document parsing in ephemeral isolated containers, and utilize deterministic try/finally blocks to destroy open stream handles and delete temporary disk files immediately.',
        },
      ],
    },
    {
      id: 'ai-ml',
      title: 'AI, Machine Learning & LLM Systems',
      subtitle: 'PyTorch, Transformers, Multimodal Telemetry & Distributed Inference',
      questions: [
        {
          id: 1,
          category: 'Model Serving & Quantization',
          question: 'Compare FP16, INT8, and 4-bit AWQ quantization in terms of memory footprint, perplexity degradation, and inference throughput on edge GPUs.',
          expectedKeyPoints: ['VRAM reduction factors', 'Weight-only vs activation quantization', 'Kernel fusion benefits in vLLM / TensorRT-LLM'],
          sampleModelAnswer: 'AWQ selectively preserves salient weights to maintain lower perplexity than naive RTN quantization while yielding a 3-4x memory footprint reduction and allowing edge inference on consumer hardware.',
        },
        {
          id: 2,
          category: 'Retrieval-Augmented Generation (RAG)',
          question: 'How would you architect a production RAG system that eliminates hallucination when indexing dynamic corporate compliance manuals?',
          expectedKeyPoints: ['Semantic chunking with overlapping windows', 'Hybrid search (Dense vectors + BM25 keyword)', 'Cross-encoder reranking', 'Strict citation grounding'],
          sampleModelAnswer: 'Combine hierarchical markdown chunking with hybrid dense-sparse retrieval, rerank with a cross-encoder model, and enforce structured JSON schemas requiring exact verbatim citation anchors before generation.',
        },
      ],
    },
    {
      id: 'devops-infra',
      title: 'DevOps, Cloud & High-Availability Grids',
      subtitle: 'Kubernetes, Terraform, Zero-Downtime Blue/Green, Observability',
      questions: [
        {
          id: 1,
          category: 'Kubernetes Networking & Fault Tolerance',
          question: 'Describe how Kubernetes handles pod eviction under node memory pressure and how to prevent cascade outages using PodDisruptionBudgets.',
          expectedKeyPoints: ['Kubelet eviction thresholds', 'QoS classes (Guaranteed, Burstable, BestEffort)', 'PDB configuration for high availability'],
          sampleModelAnswer: 'Kubelet evicts BestEffort pods first. Defining explicit requests equal to limits ensures Guaranteed QoS, while PodDisruptionBudgets enforce minimum available replicas during rolling updates or voluntary disruptions.',
        },
      ],
    },
  ];

  const currentTrackObj = interviewTracks.find(t => t.id === selectedTrack) || interviewTracks[0];
  const questionsList: Question[] = currentTrackObj.questions;
  const currentQ: Question = questionsList[currentQuestionIdx] || questionsList[0];

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    setStage('active');
    setCurrentQuestionIdx(0);
    setAnswers({});
    setCandidateAnswer('');
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const handleNextQuestion = () => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: candidateAnswer }));
    setCandidateAnswer('');
    if (currentQuestionIdx < questionsList.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setIsTimerRunning(false);
      setStage('completed');
    }
  };

  const calculateReadinessScore = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount === 0) return 72;
    const base = 75 + Math.min(answeredCount * 7, 20);
    return Math.min(base, 96);
  };

  return (
    <div className="space-y-12 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="space-y-4 pt-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/60 border border-indigo-500/40 text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AUTONOMOUS CANDIDATE PREPARATION PLATFORM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Interview Studio &amp; Technical Simulator
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Simulate enterprise technical interviews designed by Nexus Dynamics hiring committees. Receive instant evaluation against model answer benchmarks and communication criteria.
        </p>
      </div>

      {/* ========================================================== */}
      {/* STAGE 1: SETUP VIEW */}
      {/* ========================================================== */}
      {stage === 'setup' && (
        <div className="nexus-glass-card rounded-3xl p-6 sm:p-10 border border-indigo-500/30 bg-[#0a0e28]/80 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Select Practice Requisition Track</h2>
            <p className="text-xs text-slate-400">
              Each discipline simulates question pools curated by technical leads across our 6 business divisions.
            </p>
          </div>

          {/* Track selector grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interviewTracks.map(track => (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedTrack(track.id)}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                  selectedTrack === track.id
                    ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-lg shadow-cyan-500/10'
                    : 'border-white/10 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{track.title}</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                    {track.questions.length} Questions
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{track.subtitle}</p>
              </button>
            ))}
          </div>

          {/* Difficulty selector */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Experience Target
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'associate', label: 'Associate / Entry Level' },
                { id: 'senior', label: 'Senior Staff Engineer' },
                { id: 'principal', label: 'Principal Architect & Technical Director' },
              ].map(diff => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    difficulty === diff.id
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-4 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Estimated duration: 10 - 15 minutes</span>
            </div>

            <button
              type="button"
              onClick={handleStartSession}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-cyan-200 fill-current" />
              <span>Begin Technical Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* STAGE 2: ACTIVE INTERVIEW SESSION */}
      {/* ========================================================== */}
      {stage === 'active' && (
        <div className="nexus-glass-card rounded-3xl p-6 sm:p-10 border border-indigo-500/30 bg-[#090d24]/80 space-y-8">
          {/* Top Status Bar: Track, Progress & Timer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                ACTIVE PRACTICE SESSION &bull; {currentTrackObj.title}
              </span>
              <h2 className="text-base font-bold text-white">
                Question {currentQuestionIdx + 1} of {questionsList.length}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Elapsed: {formatTimer(timerSeconds)}</span>
              </div>

              <button
                type="button"
                onClick={() => setStage('setup')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Exit Session
              </button>
            </div>
          </div>

          {/* Question Display Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1338] to-[#0a0f28] border border-indigo-500/30 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/40">
              {currentQ.category}
            </span>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Candidate Response Workspace */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Your Technical Response (Speech or Written)
              </label>

              {/* Microphone Simulation Button */}
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {isRecording ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Listening (Simulated)...' : 'Enable Voice Dictation'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              placeholder="Structure your answer clearly: state foundational mechanisms, trade-offs, architecture patterns, and production error mitigation..."
              value={candidateAnswer}
              onChange={e => setCandidateAnswer(e.target.value)}
              className="w-full bg-[#070a1a] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          {/* Key Evaluation Anchors Hint */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Recommended Technical Anchors:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-400">
              {currentQ.expectedKeyPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>

          {/* Controls: Next or Finish */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={handleNextQuestion}
              className="text-xs text-slate-400 hover:text-white"
            >
              Skip Question
            </button>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{currentQuestionIdx < questionsList.length - 1 ? 'Save & Proceed' : 'Submit & Score'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* STAGE 3: COMPLETED RESULTS & SCORECARD */}
      {/* ========================================================== */}
      {stage === 'completed' && (
        <div className="nexus-glass-card rounded-3xl p-6 sm:p-10 border border-indigo-500/30 bg-[#090d24]/80 space-y-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Evaluation Complete
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Your technical responses have been evaluated against Nexus Dynamics senior engineering rubric.
            </p>
          </div>

          {/* Score Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Overall Readiness</span>
              <div className="text-3xl font-black text-emerald-400">{calculateReadinessScore()}%</div>
              <span className="text-[11px] text-emerald-300">Strong Candidate Tier</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Duration</span>
              <div className="text-3xl font-black text-white">{formatTimer(timerSeconds)}</div>
              <span className="text-[11px] text-cyan-400">Paced Well</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Questions Answered</span>
              <div className="text-3xl font-black text-white">{Object.keys(answers).length} / {questionsList.length}</div>
              <span className="text-[11px] text-purple-300">Complete Coverage</span>
            </div>
          </div>

          {/* Model Answers Review */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="font-bold text-white text-base">Key Question Review &amp; Model Answers</h3>
            {questionsList.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300">Question {idx + 1}: {q.category}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Evaluated
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">{q.question}</p>
                <div className="text-xs text-slate-300 pt-1 leading-relaxed bg-[#060814]/70 p-3 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan-400 block">Nexus Model Solution Benchmark:</strong>
                    <button
                      type="button"
                      onClick={() => handleCopyBenchmark(q.id, q.sampleModelAnswer)}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === q.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p>{q.sampleModelAnswer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleStartSession}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry / Practice Another Track</span>
            </button>

            <Link
              to="/careers"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Relevant Open Roles</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewStudioPage;
