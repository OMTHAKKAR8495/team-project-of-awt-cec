import { Job, JobQueryParams } from '../types/job';
import { Candidate, CandidateQueryParams } from '../types/candidate';

export const FALLBACK_JOBS: Job[] = [
  {
    _id: '507f1f77bcf86cd799439001',
    title: 'Senior Full Stack Engineer (Cloud & AI)',
    company: 'Nexus Dynamics',
    description: 'We are seeking an ambitious Senior Full Stack Engineer to architect frontier enterprise web platforms. You will develop responsive React applications, optimize serverless microservices with Node.js and TypeScript, and integrate cutting-edge AI models.',
    location: 'New York, NY / Remote',
    employmentType: 'full-time',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git'],
    preferredSkills: ['Docker', 'AWS', 'GraphQL', 'Tailwind CSS', 'CI/CD'],
    responsibilities: [
      'Architect and deliver responsive web applications with React 19 and TypeScript.',
      'Develop secure, scalable backend microservices using Node.js, Express, and PostgreSQL.',
      'Collaborate with product designers to ship intuitive workflows with sub-second latency.',
      'Maintain automated unit, integration, and security regression test suites.',
    ],
    requirements: [
      '3+ years of professional full-stack development experience.',
      'Strong proficiency in modern JavaScript/TypeScript, React hooks, and asynchronous Node.js.',
      'Experience with relational or NoSQL database modeling and query performance tuning.',
    ],
    salaryRange: {
      min: 140000,
      max: 185000,
      currency: 'USD',
    },
    status: 'open',
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-10-29T10:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439002',
    title: 'Frontend Engineer (React / Next.js / Tailwind)',
    company: 'Nexus Cloud Innovations',
    description: 'Join our dynamic frontend team to craft visually stunning, highly interactive web applications. You will turn design mockups into pixel-perfect React components and optimize core web vitals.',
    location: 'San Francisco, CA / Hybrid',
    employmentType: 'full-time',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Git'],
    preferredSkills: ['Next.js', 'Redux', 'Jest', 'Accessibility (a11y)', 'Figma'],
    responsibilities: [
      'Build reusable, accessible UI component primitives with React, TypeScript, and Tailwind CSS.',
      'Optimize web performance, dynamic code-splitting, and Lighthouse CWV metrics.',
      'Ensure high accessibility standards across desktop and mobile browsers.',
    ],
    requirements: [
      '2+ years of hands-on experience building production React web applications.',
      'Solid command of CSS Grid, Flexbox, responsive layouts, and Tailwind utility systems.',
      'Familiarity with modern client bundle tooling like Vite and Rollup.',
    ],
    salaryRange: {
      min: 110000,
      max: 150000,
      currency: 'USD',
    },
    status: 'open',
    createdAt: '2026-10-19T11:00:00.000Z',
    updatedAt: '2026-10-29T11:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439003',
    title: 'AI & Machine Learning Research Scientist',
    company: 'Nexus Frontier AI Labs',
    description: 'Looking for an innovative AI research scientist to train, fine-tune, and deploy multimodal transformer models for autonomous decisioning and real-time inference microservices.',
    location: 'Zurich, Switzerland / Hybrid',
    employmentType: 'full-time',
    requiredSkills: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'FastAPI', 'SQL'],
    preferredSkills: ['TensorFlow', 'NLP', 'GCP', 'Docker', 'Pandas', 'Scikit-learn'],
    responsibilities: [
      'Train deep neural network architectures using PyTorch and HuggingFace transformers.',
      'Develop real-time inference microservices packaged in lightweight Docker containers.',
      'Perform data feature engineering and distributed GPU training optimizations.',
    ],
    requirements: [
      'Master degree or equivalent experience in AI, Computer Science, or Mathematics.',
      'Verifiable experience fine-tuning transformer models and evaluating model perplexity.',
      'Strong coding skills in Python and vector mathematics.',
    ],
    salaryRange: {
      min: 160000,
      max: 230000,
      currency: 'USD',
    },
    status: 'open',
    createdAt: '2026-10-20T09:30:00.000Z',
    updatedAt: '2026-10-29T09:30:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439004',
    title: 'Cloud Infrastructure & DevOps Architect',
    company: 'Nexus Global Infrastructure',
    description: 'Architect, automate, and scale zero-trust Kubernetes clusters across multi-region cloud providers. Manage automated CI/CD continuous deployment and telemetry pipelines.',
    location: 'London, United Kingdom / Remote',
    employmentType: 'remote',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
    preferredSkills: ['Python', 'Bash', 'Prometheus', 'Grafana', 'GCP', 'Ansible'],
    responsibilities: [
      'Manage container orchestration with Kubernetes, Helm charts, and GitOps workflows.',
      'Automate cloud infrastructure provisioning using declarative Terraform scripts.',
      'Set up zero-downtime blue/green deployment pipelines with GitHub Actions.',
    ],
    requirements: [
      '4+ years of professional DevOps and cloud infrastructure engineering experience.',
      'Hands-on mastery of AWS networking (VPC, IAM, EKS, Route53, CloudFront).',
      'Solid understanding of Linux kernel fundamentals and container security.',
    ],
    salaryRange: {
      min: 135000,
      max: 180000,
      currency: 'USD',
    },
    status: 'open',
    createdAt: '2026-10-21T14:15:00.000Z',
    updatedAt: '2026-10-29T14:15:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439005',
    title: 'Principal Product UX/UI Designer',
    company: 'Nexus Digital Design Studio',
    description: 'Lead visual design and user experience architecture across enterprise analytics applications. Conduct customer usability research and maintain design system tokens in Figma.',
    location: 'Bengaluru, India / Hybrid',
    employmentType: 'full-time',
    requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping'],
    preferredSkills: ['Design Systems', 'User Personas', 'HTML/CSS', 'Design Tokens'],
    responsibilities: [
      'Design comprehensive wireframes, user journeys, and high-fidelity interactive prototypes.',
      'Conduct user testing sessions to identify UX bottlenecks and validate usability.',
      'Partner closely with frontend engineers to ensure design token consistency.',
    ],
    requirements: [
      '3+ years of experience in product design with a portfolio of shipped digital products.',
      'Mastery of Figma component variants, auto-layout, and interactive prototyping.',
    ],
    salaryRange: {
      min: 95000,
      max: 140000,
      currency: 'USD',
    },
    status: 'open',
    createdAt: '2026-10-22T08:00:00.000Z',
    updatedAt: '2026-10-29T08:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439006',
    title: 'Quantitative Risk & Financial Systems Analyst',
    company: 'Nexus Capital Markets',
    description: 'Develop algorithmic risk metrics, liquidity monitoring engines, and financial compliance auditing workflows for global enterprise M&A transactions.',
    location: 'Singapore, Singapore / On-site',
    employmentType: 'full-time',
    requiredSkills: ['Python', 'SQL', 'Financial Modeling', 'Data Analysis', 'Risk Management'],
    preferredSkills: ['R', 'Tableau', 'Power BI', 'Monte Carlo Simulation', 'QuantLib'],
    responsibilities: [
      'Construct automated Monte Carlo risk models evaluating portfolio exposures.',
      'Author real-time SQL data extraction pipelines for executive trading telemetry.',
      'Coordinate with regulatory compliance bodies to verify capital reserves.',
    ],
    requirements: [
      'Degree in Finance, Economics, Statistics, or Computational Mathematics.',
      '2+ years of analytical experience in investment banking, risk, or corporate finance.',
    ],
    salaryRange: {
      min: 120000,
      max: 165000,
      currency: 'USD',
    },
    status: 'open',
    createdAt: '2026-10-23T12:00:00.000Z',
    updatedAt: '2026-10-29T12:00:00.000Z',
  },
];

export const FALLBACK_CANDIDATES: Candidate[] = [
  {
    _id: '507f1f77bcf86cd799439101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    job: {
      _id: '507f1f77bcf86cd799439001',
      title: 'Senior Full Stack Engineer (Cloud & AI)',
      company: 'Nexus Dynamics',
      location: 'New York, NY / Remote',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git'],
    },
    resume: {
      originalName: 'Aarav_Sharma_FullStack_Resume.pdf',
      fileName: 'Aarav_Sharma_Resume.pdf',
      fileSize: 124500,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-25T14:20:00.000Z',
    },
    extractedSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Docker', 'AWS', 'Git', 'Tailwind CSS'],
    atsScore: 92,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git'],
    missingSkills: [],
    applicationStatus: 'shortlisted',
    notes: 'Exceptional full-stack architecture background. High ATS match across all required engineering skills.',
    createdAt: '2026-10-25T14:20:00.000Z',
    updatedAt: '2026-10-29T12:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439102',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98123 45678',
    job: {
      _id: '507f1f77bcf86cd799439003',
      title: 'AI & Machine Learning Research Scientist',
      company: 'Nexus Frontier AI Labs',
      location: 'Zurich, Switzerland / Hybrid',
      requiredSkills: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'FastAPI', 'SQL'],
    },
    resume: {
      originalName: 'Priya_Patel_DataScientist_Resume.pdf',
      fileName: 'Priya_Patel_Resume.pdf',
      fileSize: 138000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-26T09:15:00.000Z',
    },
    extractedSkills: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'FastAPI', 'SQL', 'TensorFlow', 'Docker'],
    atsScore: 96,
    matchedSkills: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'FastAPI', 'SQL'],
    missingSkills: [],
    applicationStatus: 'hired',
    notes: 'Outstanding research publication history and practical model fine-tuning credentials.',
    createdAt: '2026-10-26T09:15:00.000Z',
    updatedAt: '2026-10-29T14:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439103',
    name: 'Rohan Verma',
    email: 'rohan.verma@example.com',
    phone: '+91 97234 56789',
    job: {
      _id: '507f1f77bcf86cd799439004',
      title: 'Cloud Infrastructure & DevOps Architect',
      company: 'Nexus Global Infrastructure',
      location: 'London, United Kingdom / Remote',
      requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
    },
    resume: {
      originalName: 'Rohan_Verma_DevOps.pdf',
      fileName: 'Rohan_Verma_DevOps.pdf',
      fileSize: 118000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-27T11:40:00.000Z',
    },
    extractedSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Python', 'Terraform', 'Prometheus'],
    atsScore: 88,
    matchedSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
    missingSkills: [],
    applicationStatus: 'shortlisted',
    notes: 'Strong multi-cluster Kubernetes deployment skills on AWS.',
    createdAt: '2026-10-27T11:40:00.000Z',
    updatedAt: '2026-10-29T11:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439104',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phone: '+91 99876 54321',
    job: {
      _id: '507f1f77bcf86cd799439002',
      title: 'Frontend Engineer (React / Next.js / Tailwind)',
      company: 'Nexus Cloud Innovations',
      location: 'San Francisco, CA / Hybrid',
      requiredSkills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Git'],
    },
    resume: {
      originalName: 'Ananya_Iyer_Frontend.pdf',
      fileName: 'Ananya_Iyer_Frontend.pdf',
      fileSize: 112000,
      mimeType: 'application/pdf',
      uploadedAt: '2026-10-28T16:10:00.000Z',
    },
    extractedSkills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Git', 'Next.js', 'Redux'],
    atsScore: 84,
    matchedSkills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Git'],
    missingSkills: [],
    applicationStatus: 'pending',
    notes: 'Clean component architecture and strong accessibility knowledge.',
    createdAt: '2026-10-28T16:10:00.000Z',
    updatedAt: '2026-10-29T09:00:00.000Z',
  },
];

export function filterFallbackJobs(params?: JobQueryParams) {
  let list = [...FALLBACK_JOBS];

  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.requiredSkills.some(s => s.toLowerCase().includes(q))
    );
  }

  if (params?.status) {
    list = list.filter(j => j.status === params.status);
  }

  if (params?.employmentType) {
    list = list.filter(j => j.employmentType === params.employmentType);
  }

  const page = params?.page || 1;
  const limit = params?.limit || 9;
  const start = (page - 1) * limit;
  const paginated = list.slice(start, start + limit);

  return {
    success: true,
    data: paginated,
    pagination: {
      total: list.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(list.length / limit)),
    },
  };
}

export function filterFallbackCandidates(params?: CandidateQueryParams) {
  let list = [...FALLBACK_CANDIDATES];

  if (params?.jobId) {
    list = list.filter(c => {
      const jobId = typeof c.job === 'string' ? c.job : c.job._id;
      return jobId === params.jobId;
    });
  }

  if (params?.status) {
    list = list.filter(c => c.applicationStatus === params.status);
  }

  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const start = (page - 1) * limit;
  const paginated = list.slice(start, start + limit);

  return {
    success: true,
    data: paginated,
    pagination: {
      total: list.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(list.length / limit)),
    },
  };
}

