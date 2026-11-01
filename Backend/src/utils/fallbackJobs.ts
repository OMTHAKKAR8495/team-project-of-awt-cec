export interface FallbackJobItem {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  requirements?: string[];
  responsibilities?: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export const BACKEND_FALLBACK_JOBS: FallbackJobItem[] = [
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
    title: 'Lead Machine Learning & NLP Scientist',
    company: 'Nexus Artificial Intelligence Labs',
    description: 'Lead research and deployment of sovereign multi-modal language models and vector search architectures. You will build high-throughput inference pipelines for Fortune 500 predictive analytics.',
    location: 'Zurich, Switzerland / Hybrid',
    employmentType: 'full-time',
    requiredSkills: ['Python', 'PyTorch', 'Machine Learning', 'NLP', 'Transformers', 'Docker'],
    preferredSkills: ['Kubernetes', 'FastAPI', 'MLOps', 'CUDA', 'Vector Databases'],
    responsibilities: [
      'Design, train, and evaluate transformer-based architectures for enterprise NLP.',
      'Build low-latency inference endpoints capable of servicing 50k+ daily queries.',
      'Partner with enterprise security to ensure data sovereignty and ethical AI alignment.',
    ],
    requirements: [
      'MS or PhD in Computer Science, Machine Learning, or Computational Linguistics.',
      'Proven track record delivering machine learning models to production.',
      'Deep fluency with PyTorch, Hugging Face transformers, and distributed GPU training.',
    ],
    salaryRange: {
      min: 165000,
      max: 220000,
      currency: 'USD',
    },
    status: 'open',
    createdAt: '2026-10-20T09:30:00.000Z',
    updatedAt: '2026-10-29T09:30:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439004',
    title: 'Distributed Systems & Cloud DevOps Architect',
    company: 'Nexus Global Infrastructure',
    description: 'Architect mission-critical cloud backbones spanning multi-region AWS and Kubernetes clusters. You will implement immutable infrastructure-as-code and 99.999% uptime resilience.',
    location: 'London, United Kingdom / Remote',
    employmentType: 'full-time',
    requiredSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux'],
    preferredSkills: ['Golang', 'Prometheus', 'Grafana', 'Ansible', 'Security Architecture'],
    responsibilities: [
      'Maintain automated multi-cluster Kubernetes deployments with zero downtime.',
      'Implement unified telemetry, log aggregation, and automated incident recovery.',
      'Enforce least-privilege IAM policies, SOC2 compliance, and vulnerability scanners.',
    ],
    requirements: [
      '4+ years architecting AWS infrastructure using Terraform or OpenTofu.',
      'Expertise in container orchestration, service meshes, and disaster recovery.',
    ],
    salaryRange: {
      min: 135000,
      max: 180000,
      currency: 'USD',
    },
    status: 'open',
    createdAt: '2026-10-21T08:00:00.000Z',
    updatedAt: '2026-10-29T08:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439005',
    title: 'Autonomous Robotics & Firmware Systems Architect',
    company: 'Nexus Advanced Engineering',
    description: 'Design deterministic embedded firmware and low-level robotics control systems for next-generation factory logistics and clean-energy grid automation.',
    location: 'Bengaluru, India / On-site',
    employmentType: 'full-time',
    requiredSkills: ['C++', 'Embedded Systems', 'RTOS', 'Linux', 'Microcontrollers'],
    preferredSkills: ['ROS2', 'CAN Bus', 'Python', 'PCB Design', 'Simulink'],
    responsibilities: [
      'Author real-time control algorithms for multi-axis industrial robots.',
      'Optimize sensor fusion feeds (LiDAR, IMU, computer vision) with sub-millisecond jitter.',
    ],
    requirements: [
      'BS in Electrical Engineering, Mechatronics, or Robotics.',
      'Hands-on experience with FreeRTOS or embedded Linux on ARM Cortex processors.',
    ],
    salaryRange: {
      min: 90000,
      max: 135000,
      currency: 'USD',
    },
    status: 'open',
    createdAt: '2026-10-22T14:00:00.000Z',
    updatedAt: '2026-10-29T14:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439006',
    title: 'Senior Vice President - Multinational M&A & Capital Allocation',
    company: 'Nexus Financial Advisory',
    description: 'Direct high-impact corporate acquisitions, multinational capital structuring, and strategic financial risk underwriting across transatlantic corridors.',
    location: 'New York, NY / Hybrid',
    employmentType: 'full-time',
    requiredSkills: ['Financial Modeling', 'M&A Due Diligence', 'Corporate Valuation', 'Capital Allocation'],
    preferredSkills: ['CFA', 'Cross-Border Tax', 'Private Equity', 'SEC Compliance'],
    responsibilities: [
      'Lead valuation modeling, debt structuring, and due diligence on $500M+ corporate transactions.',
      'Present strategic allocation forecasts directly to the Board of Directors.',
    ],
    requirements: [
      '6+ years of investment banking, private equity, or strategic financial leadership.',
      'Comprehensive mastery of discounted cash flow, LBO, and accretion/dilution models.',
    ],
    salaryRange: {
      min: 195000,
      max: 275000,
      currency: 'USD',
    },
    status: 'open',
    createdAt: '2026-10-23T16:00:00.000Z',
    updatedAt: '2026-10-29T16:00:00.000Z',
  }
];
