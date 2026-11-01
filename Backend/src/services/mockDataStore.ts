import { Types } from 'mongoose';
import { IJob, IJobDocument, EmploymentType, JobStatus } from '../models/Job';
import { ICandidate, ICandidateDocument, ApplicationStatus } from '../models/Candidate';
import { JobFilterParams, PaginatedJobsResult } from './jobService';
import { CandidateFilterParams, PaginatedCandidatesResult, ApplyCandidateDTO } from './candidateService';
import { AppError } from '../middleware/error.middleware';
import {
  extractResumeText,
  extractSkillsFromText,
  calculateATSScore,
} from '../utils/resumeAnalyzer';
import { cleanupFile } from '../middleware/uploadMiddleware';

// Initial pre-seeded enterprise job postings covering all divisions
const INITIAL_MOCK_JOBS: Array<IJob & { _id: Types.ObjectId }> = [
  {
    _id: new Types.ObjectId('671a2b3c4d5e6f7a8b9c0d11'),
    title: 'Senior Cloud & AI Platform Architect',
    company: 'Apex Cloud Systems',
    description:
      'Design, architect, and optimize next-generation distributed multi-region cloud backbones and generative AI orchestration pipelines. Work closely with cross-functional infrastructure and machine learning engineering teams.',
    location: 'San Francisco, CA (Hybrid)',
    employmentType: 'full-time',
    requiredSkills: ['TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
    preferredSkills: ['Terraform', 'GraphQL', 'Go', 'Redis'],
    requirements: [
      '5+ years architecting scalable cloud-native architectures',
      'Strong expertise in distributed microservices and container orchestration',
      'Deep understanding of REST, gRPC, and asynchronous event streams',
    ],
    responsibilities: [
      'Lead architectural reviews and system design sessions',
      'Optimize latency and throughput of mission-critical cloud pipelines',
      'Mentor senior and staff engineering personnel',
    ],
    salaryRange: { min: 160000, max: 210000, currency: 'USD' },
    status: 'open',
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    _id: new Types.ObjectId('671a2b3c4d5e6f7a8b9c0d12'),
    title: 'Full Stack React & Node.js Engineer',
    company: 'Nexus Digital Technologies',
    description:
      'Develop modern high-performance web applications using React, TypeScript, Tailwind CSS, and scalable Express REST APIs with an emphasis on seamless user experience and accessibility.',
    location: 'Remote (Global)',
    employmentType: 'full-time',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'JavaScript'],
    preferredSkills: ['MongoDB', 'Next.js', 'Vite', 'Jest'],
    requirements: [
      '3+ years of professional full-stack development experience',
      'Proven expertise building rich interactive client interfaces and modular component libraries',
    ],
    responsibilities: [
      'Build responsive, production-ready frontend components',
      'Develop robust REST APIs with strict input validation',
      'Collaborate with UI/UX designers to refine micro-interactions',
    ],
    salaryRange: { min: 110000, max: 150000, currency: 'USD' },
    status: 'open',
    createdAt: new Date(Date.now() - 86400000 * 4),
    updatedAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    _id: new Types.ObjectId('671a2b3c4d5e6f7a8b9c0d13'),
    title: 'Smart Grid Systems & IoT Engineering Lead',
    company: 'VoltGrid Energy Solutions',
    description:
      'Lead the engineering of high-frequency SCADA telemetry pipelines and distributed sensor networks for national-scale electrical transmission grids.',
    location: 'Austin, TX (On-site)',
    employmentType: 'full-time',
    requiredSkills: ['Python', 'C++', 'IoT', 'Engineering', 'Docker'],
    preferredSkills: ['Kafka', 'MQTT', 'Embedded Systems', 'Rust'],
    requirements: [
      'Bachelor or Master degree in Electrical Engineering or Computer Engineering',
      'Experience with industrial IoT protocols and time-series telemetry pipelines',
    ],
    responsibilities: [
      'Design fault-tolerant edge gateway protocols',
      'Collaborate with utility network engineers on grid safety compliance',
    ],
    salaryRange: { min: 135000, max: 175000, currency: 'USD' },
    status: 'open',
    createdAt: new Date(Date.now() - 86400000 * 6),
    updatedAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    _id: new Types.ObjectId('671a2b3c4d5e6f7a8b9c0d14'),
    title: 'Quantitative Risk & Financial Modeling Lead',
    company: 'Sovereign Capital Holdings',
    description:
      'Develop algorithmic risk exposure engines, statistical stress-testing frameworks, and portfolio optimization models across international equity and derivatives markets.',
    location: 'New York, NY (Hybrid)',
    employmentType: 'full-time',
    requiredSkills: ['Python', 'SQL', 'Finance', 'Financial Analysis', 'Risk Management'],
    preferredSkills: ['R', 'Machine Learning', 'Pandas', 'NumPy'],
    requirements: [
      'Degree in Quantitative Finance, Mathematics, or Computational Statistics',
      'Deep fluency in Value at Risk (VaR) modeling and Monte Carlo simulations',
    ],
    responsibilities: [
      'Build real-time volatility and liquidity analytics models',
      'Present quantitative risk assessments to investment executive committees',
    ],
    salaryRange: { min: 180000, max: 240000, currency: 'USD' },
    status: 'open',
    createdAt: new Date(Date.now() - 86400000 * 8),
    updatedAt: new Date(Date.now() - 86400000 * 4),
  },
  {
    _id: new Types.ObjectId('671a2b3c4d5e6f7a8b9c0d15'),
    title: 'Healthcare Analytics & Clinical Data Scientist',
    company: 'BioVanguard Health',
    description:
      'Analyze multi-omic clinical trials data and healthcare records to train predictive diagnostic models and patient outcome telemetry systems.',
    location: 'Boston, MA (Hybrid)',
    employmentType: 'full-time',
    requiredSkills: ['Python', 'Health', 'Healthcare', 'SQL', 'Machine Learning'],
    preferredSkills: ['Bioinformatics', 'R', 'TensorFlow', 'HIPAA'],
    requirements: [
      'Experience handling protected health information (PHI) and clinical trial data',
      'Proficiency in survival analysis and biomedical predictive pipelines',
    ],
    responsibilities: [
      'Develop machine learning models for early clinical symptom detection',
      'Deliver regulatory-compliant analytical documentation for peer review',
    ],
    salaryRange: { min: 140000, max: 185000, currency: 'USD' },
    status: 'open',
    createdAt: new Date(Date.now() - 86400000 * 10),
    updatedAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    _id: new Types.ObjectId('671a2b3c4d5e6f7a8b9c0d16'),
    title: 'Global Brand & Strategic Communications Lead',
    company: 'Horizon Brand Group',
    description:
      'Direct omnichannel executive messaging, investor communications, international brand positioning, and digital public relations campaigns.',
    location: 'London, UK (Hybrid)',
    employmentType: 'full-time',
    requiredSkills: ['Communications', 'Brand Management', 'Public Relations', 'Marketing'],
    preferredSkills: ['Content Strategy', 'Crisis Communications', 'SEO'],
    requirements: [
      '5+ years leading high-growth corporate communications and brand campaigns',
      'Demonstrated portfolio of international media placements and brand revamps',
    ],
    responsibilities: [
      'Shape enterprise narrative across press, corporate summits, and social platforms',
      'Coordinate media briefings and crisis communication preparedness',
    ],
    salaryRange: { min: 115000, max: 155000, currency: 'USD' },
    status: 'open',
    createdAt: new Date(Date.now() - 86400000 * 12),
    updatedAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    _id: new Types.ObjectId('671a2b3c4d5e6f7a8b9c0d17'),
    title: 'Director of Global Talent Acquisition & HR Strategy',
    company: 'Apex Global Enterprises',
    description:
      'Scale enterprise talent acquisition infrastructure, optimize ATS recruitment funnels, and spearhead executive hiring across Americas, EMEA, and APAC regions.',
    location: 'Remote (US/EU)',
    employmentType: 'full-time',
    requiredSkills: ['HR', 'Talent Acquisition', 'Recruiting', 'Executive Search'],
    preferredSkills: ['Workday', 'LinkedIn Recruiter', 'People Analytics'],
    requirements: [
      'Proven track record leading global talent acquisition teams in technology or engineering',
      'Deep understanding of competitive market compensation and retention strategies',
    ],
    responsibilities: [
      'Architect full-lifecycle recruitment strategy and candidate experience workflows',
      'Drive data-driven talent pipeline reporting for C-level leadership',
    ],
    salaryRange: { min: 145000, max: 195000, currency: 'USD' },
    status: 'open',
    createdAt: new Date(Date.now() - 86400000 * 14),
    updatedAt: new Date(Date.now() - 86400000 * 7),
  },
];

class InMemoryStore {
  private jobs: Array<IJob & { _id: Types.ObjectId }> = [];
  private candidates: Array<ICandidate & { _id: Types.ObjectId }> = [];

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.jobs = JSON.parse(JSON.stringify(INITIAL_MOCK_JOBS)).map((j: any) => ({
      ...j,
      _id: new Types.ObjectId(j._id),
      createdAt: new Date(j.createdAt),
      updatedAt: new Date(j.updatedAt),
    }));
    this.candidates = [];
  }

  // --- Jobs Methods ---
  public async getJobs(params: JobFilterParams): Promise<PaginatedJobsResult> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));

    let filtered = [...this.jobs];

    if (params.status) {
      filtered = filtered.filter(j => j.status === params.status);
    }

    if (params.employmentType) {
      filtered = filtered.filter(j => j.employmentType === params.employmentType);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(j => {
        return (
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.requiredSkills.some(s => s.toLowerCase().includes(q))
        );
      });
    }

    // Sort descending by createdAt
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const pageItems = filtered.slice(startIndex, startIndex + limit);

    return {
      jobs: pageItems as unknown as IJobDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async getJobById(id: string): Promise<IJobDocument> {
    const job = this.jobs.find(j => j._id.toString() === id);
    if (!job) {
      throw new AppError(`Job with ID '${id}' was not found.`, 404);
    }
    return job as unknown as IJobDocument;
  }

  public async createJob(jobData: Partial<IJob>): Promise<IJobDocument> {
    const newJob: IJob & { _id: Types.ObjectId } = {
      _id: new Types.ObjectId(),
      title: jobData.title || 'Untitled Role',
      company: jobData.company || 'Enterprise Corp',
      description: jobData.description || '',
      location: jobData.location || 'Remote',
      employmentType: (jobData.employmentType as EmploymentType) || 'full-time',
      requiredSkills: jobData.requiredSkills || [],
      preferredSkills: jobData.preferredSkills || [],
      requirements: jobData.requirements || [],
      responsibilities: jobData.responsibilities || [],
      salaryRange: jobData.salaryRange,
      status: (jobData.status as JobStatus) || 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobs.unshift(newJob);
    return newJob as unknown as IJobDocument;
  }

  public async updateJob(id: string, updateData: Partial<IJob>): Promise<IJobDocument> {
    const index = this.jobs.findIndex(j => j._id.toString() === id);
    if (index === -1) {
      throw new AppError(`Job with ID '${id}' was not found.`, 404);
    }

    const existing = this.jobs[index];
    const updated = {
      ...existing,
      ...updateData,
      _id: existing._id,
      updatedAt: new Date(),
    };

    this.jobs[index] = updated;
    return updated as unknown as IJobDocument;
  }

  public async deleteJob(id: string): Promise<IJobDocument> {
    const index = this.jobs.findIndex(j => j._id.toString() === id);
    if (index === -1) {
      throw new AppError(`Job with ID '${id}' was not found.`, 404);
    }

    const [deleted] = this.jobs.splice(index, 1);
    this.candidates = this.candidates.filter(c => c.job.toString() !== id);
    return deleted as unknown as IJobDocument;
  }

  // --- Candidate Methods ---
  public async applyCandidate(dto: ApplyCandidateDTO): Promise<ICandidateDocument> {
    const { name, email, phone, jobId, notes, file } = dto;

    try {
      const job = await this.getJobById(jobId);

      if (job.status !== 'open') {
        throw new AppError(
          `Job '${job.title}' is currently closed. Applications cannot be accepted.`,
          400
        );
      }

      const existing = this.candidates.find(
        c => c.job.toString() === jobId && c.email.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        throw new AppError(
          `An application for '${email}' has already been submitted for this position.`,
          409
        );
      }

      const rawText = await extractResumeText(file.path, file.mimetype);
      const extractedSkills = extractSkillsFromText(rawText);
      const atsResult = calculateATSScore(
        rawText,
        extractedSkills,
        job.requiredSkills,
        job.preferredSkills || [],
        job.requirements || []
      );

      const newCandidate: ICandidate & { _id: Types.ObjectId } = {
        _id: new Types.ObjectId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : undefined,
        job: new Types.ObjectId(jobId),
        resume: {
          originalName: file.originalname,
          fileName: file.filename,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedAt: new Date(),
        },
        extractedSkills: atsResult.extractedSkills,
        atsScore: atsResult.score,
        matchedSkills: atsResult.matchedSkills,
        missingSkills: atsResult.missingSkills,
        applicationStatus: 'pending',
        notes: notes ? notes.trim() : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.candidates.unshift(newCandidate);
      return newCandidate as unknown as ICandidateDocument;
    } finally {
      await cleanupFile(file.path);
    }
  }

  public async getCandidates(params: CandidateFilterParams): Promise<PaginatedCandidatesResult> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));

    let filtered = [...this.candidates];

    if (params.jobId) {
      filtered = filtered.filter(c => c.job.toString() === params.jobId);
    }

    if (params.status) {
      filtered = filtered.filter(c => c.applicationStatus === params.status);
    }

    filtered.sort((a, b) => b.atsScore - a.atsScore);

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const pageItems = filtered.slice(startIndex, startIndex + limit);

    return {
      candidates: pageItems as unknown as ICandidateDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async getCandidateById(id: string): Promise<ICandidateDocument> {
    const candidate = this.candidates.find(c => c._id.toString() === id);
    if (!candidate) {
      throw new AppError(`Candidate application with ID '${id}' was not found.`, 404);
    }
    return candidate as unknown as ICandidateDocument;
  }

  public async getCandidatesByJob(jobId: string, page = 1, limit = 20): Promise<PaginatedCandidatesResult> {
    await this.getJobById(jobId);
    return this.getCandidates({ jobId, page, limit });
  }

  public async updateCandidateStatus(id: string, status: ApplicationStatus): Promise<ICandidateDocument> {
    const candidate = this.candidates.find(c => c._id.toString() === id);
    if (!candidate) {
      throw new AppError(`Candidate application with ID '${id}' was not found.`, 404);
    }
    candidate.applicationStatus = status;
    candidate.updatedAt = new Date();
    return candidate as unknown as ICandidateDocument;
  }

  public async updateCandidateNotes(id: string, notes: string): Promise<ICandidateDocument> {
    const candidate = this.candidates.find(c => c._id.toString() === id);
    if (!candidate) {
      throw new AppError(`Candidate application with ID '${id}' was not found.`, 404);
    }
    candidate.notes = notes;
    candidate.updatedAt = new Date();
    return candidate as unknown as ICandidateDocument;
  }

  public async updateCandidate(
    id: string,
    updateData: {
      name?: string;
      email?: string;
      phone?: string;
      notes?: string;
      status?: ApplicationStatus;
      applicationStatus?: ApplicationStatus;
    }
  ): Promise<ICandidateDocument> {
    const candidate = this.candidates.find(c => c._id.toString() === id);
    if (!candidate) {
      throw new AppError(`Candidate application with ID '${id}' was not found.`, 404);
    }

    if (updateData.name) candidate.name = updateData.name.trim();
    if (updateData.email) candidate.email = updateData.email.trim().toLowerCase();
    if (updateData.phone !== undefined) candidate.phone = updateData.phone.trim();
    if (updateData.notes !== undefined) candidate.notes = updateData.notes.trim();
    if (updateData.status) candidate.applicationStatus = updateData.status;
    if (updateData.applicationStatus) candidate.applicationStatus = updateData.applicationStatus;
    candidate.updatedAt = new Date();

    return candidate as unknown as ICandidateDocument;
  }

  public async deleteCandidate(id: string): Promise<ICandidateDocument> {
    const index = this.candidates.findIndex(c => c._id.toString() === id);
    if (index === -1) {
      throw new AppError(`Candidate application with ID '${id}' was not found.`, 404);
    }
    const [deleted] = this.candidates.splice(index, 1);
    return deleted as unknown as ICandidateDocument;
  }
}

export const mockStore = new InMemoryStore();
