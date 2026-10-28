/**
 * Database Seed Script
 * Populates the database with realistic sample data for demos and development.
 *
 * Usage (from Backend directory):
 *   npx ts-node src/utils/seed.ts
 *   npm run seed
 */

import path from 'path';
import dotenv from 'dotenv';

// Load env before anything else
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { Job } from '../models/Job';
import { User } from '../models/User';

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const SAMPLE_JOBS = [
  {
    title: 'Senior Software Engineer',
    company: 'TechNova Solutions',
    description:
      'We are seeking a passionate Senior Software Engineer to join our distributed backend team. ' +
      'You will design and implement scalable microservices, mentor junior engineers, and drive technical ' +
      'excellence across the organization. Our stack includes Node.js, TypeScript, MongoDB, and AWS.',
    location: 'Bangalore, India (Hybrid)',
    employmentType: 'full-time' as const,
    requiredSkills: ['Node.js', 'TypeScript', 'MongoDB', 'REST APIs', 'Git'],
    preferredSkills: ['AWS', 'Docker', 'Kubernetes', 'Redis'],
    requirements: [
      '5+ years of professional software engineering experience',
      'Strong proficiency in TypeScript and Node.js',
      'Experience with distributed systems and microservices',
      'Excellent communication and problem-solving skills',
    ],
    responsibilities: [
      'Design and build high-availability backend services',
      'Conduct code reviews and enforce engineering standards',
      'Collaborate with product and frontend teams',
      'Mentor junior team members',
    ],
    salaryRange: { min: 1800000, max: 2800000, currency: 'INR' },
    status: 'open' as const,
  },
  {
    title: 'Frontend Developer',
    company: 'PixelCraft Studios',
    description:
      'PixelCraft Studios is looking for a creative Frontend Developer who thrives on building ' +
      'delightful, accessible user interfaces. You will work closely with our design team to translate ' +
      'Figma mockups into pixel-perfect React components with excellent performance characteristics.',
    location: 'Mumbai, India (Remote-friendly)',
    employmentType: 'full-time' as const,
    requiredSkills: ['React', 'TypeScript', 'HTML', 'CSS', 'Git'],
    preferredSkills: ['Next.js', 'Tailwind CSS', 'GraphQL', 'Jest'],
    requirements: [
      '3+ years of experience building production React applications',
      'Strong understanding of web accessibility (WCAG 2.1)',
      'Experience with state management (Redux, Zustand, or React Query)',
      'Familiarity with CI/CD pipelines',
    ],
    responsibilities: [
      'Develop responsive, accessible UI components in React',
      'Optimise bundle size and Core Web Vitals',
      'Collaborate with designers and backend engineers',
      'Write unit and integration tests',
    ],
    salaryRange: { min: 1200000, max: 2000000, currency: 'INR' },
    status: 'open' as const,
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudBridge Technologies',
    description:
      'CloudBridge is scaling fast and needs a skilled DevOps Engineer to own our infrastructure. ' +
      'You will build robust CI/CD pipelines, manage Kubernetes clusters, implement security best ' +
      'practices, and ensure 99.9% uptime SLAs for our SaaS platform.',
    location: 'Pune, India (On-site)',
    employmentType: 'full-time' as const,
    requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS'],
    preferredSkills: ['Terraform', 'Helm', 'Prometheus', 'Grafana', 'Ansible'],
    requirements: [
      '4+ years of DevOps or Site Reliability Engineering experience',
      'Hands-on experience with AWS (EKS, ECS, RDS, S3)',
      'Strong scripting skills in Bash and Python',
      'Knowledge of Infrastructure-as-Code tools (Terraform or Pulumi)',
    ],
    responsibilities: [
      'Manage and scale Kubernetes clusters across multiple regions',
      'Build and maintain CI/CD pipelines (GitHub Actions, Jenkins)',
      'Implement monitoring, alerting, and incident response',
      'Enforce security policies and compliance requirements',
    ],
    salaryRange: { min: 1600000, max: 2500000, currency: 'INR' },
    status: 'open' as const,
  },
  {
    title: 'Data Scientist',
    company: 'InsightAI Labs',
    description:
      'InsightAI Labs is on a mission to make AI accessible to every business. We are looking for a ' +
      'Data Scientist to build machine-learning models that power our ATS and talent-intelligence ' +
      'products. You will work alongside ML engineers and domain experts to solve real hiring challenges.',
    location: 'Hyderabad, India (Remote)',
    employmentType: 'full-time' as const,
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Scikit-learn'],
    preferredSkills: ['TensorFlow', 'PyTorch', 'NLP', 'AWS SageMaker', 'Spark'],
    requirements: [
      'Masters or PhD in Computer Science, Statistics, or related field',
      '3+ years of industry data science experience',
      'Proficiency in Python for data analysis and ML model training',
      'Solid understanding of statistical modelling and experimentation',
    ],
    responsibilities: [
      'Design and train ML models for resume parsing and candidate scoring',
      'Conduct exploratory data analysis on large hiring datasets',
      'Collaborate with engineering to productionise models via REST APIs',
      'Present findings to non-technical stakeholders',
    ],
    salaryRange: { min: 1400000, max: 2200000, currency: 'INR' },
    status: 'open' as const,
  },
  {
    title: 'Product Manager',
    company: 'LaunchPad Ventures',
    description:
      'LaunchPad Ventures is building the next generation of B2B SaaS tools. We need a strategic ' +
      'Product Manager to own the product roadmap for our core recruitment platform. You will work ' +
      'directly with customers, engineers, and designers to ship features that move the business forward.',
    location: 'Delhi NCR, India (Hybrid)',
    employmentType: 'full-time' as const,
    requiredSkills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Stakeholder Management'],
    preferredSkills: ['SQL', 'Jira', 'Figma', 'A/B Testing', 'OKRs'],
    requirements: [
      '4+ years of product management experience in B2B SaaS',
      'Demonstrated ability to define and ship successful products',
      'Strong analytical skills — comfortable with product metrics and SQL',
      'Excellent written and verbal communication',
    ],
    responsibilities: [
      'Own the product roadmap and prioritise features based on business impact',
      'Gather and synthesise customer feedback into actionable requirements',
      'Work closely with engineering to define and deliver sprint goals',
      'Track KPIs and report product performance to leadership',
    ],
    salaryRange: { min: 2000000, max: 3200000, currency: 'INR' },
    status: 'open' as const,
  },
];

const DEMO_USERS = [
  {
    name: 'Demo Recruiter',
    email: 'recruiter@demo.com',
    password: 'Demo@1234',
    role: 'recruiter' as const,
  },
  {
    name: 'Demo Candidate',
    email: 'candidate@demo.com',
    password: 'Demo@1234',
    role: 'candidate' as const,
  },
];

// ---------------------------------------------------------------------------
// Seed logic
// ---------------------------------------------------------------------------

async function seed(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('[Seed] Error: MONGODB_URI environment variable is not set.');
    console.error('[Seed] Create a Backend/.env file (copy from .env.example) and set MONGODB_URI.');
    process.exit(1);
  }

  console.log('[Seed] Connecting to MongoDB...');
  await connectDatabase(mongoUri);

  // ---- Jobs ----
  const existingJobCount = await Job.countDocuments();
  let jobsSeeded = 0;

  if (existingJobCount > 0) {
    console.log(`[Seed] Skipping job seeding — ${existingJobCount} job(s) already exist.`);
  } else {
    const createdJobs = await Job.insertMany(SAMPLE_JOBS);
    jobsSeeded = createdJobs.length;
    console.log(`[Seed] ✅ Created ${jobsSeeded} job postings.`);
  }

  // ---- Users ----
  const SALT_ROUNDS = 12;
  let usersSeeded = 0;

  for (const userData of DEMO_USERS) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      console.log(`[Seed] Skipping user '${userData.email}' — already exists.`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    await User.create({
      name: userData.name,
      email: userData.email,
      passwordHash: hashedPassword,
      role: userData.role,
    });
    usersSeeded++;
    console.log(`[Seed] ✅ Created ${userData.role} account: ${userData.email}`);
  }

  // ---- Summary ----
  console.log('\n========================================');
  console.log('          🌱 Seed Summary');
  console.log('========================================');
  console.log(`  Jobs seeded    : ${jobsSeeded}`);
  console.log(`  Users seeded   : ${usersSeeded}`);
  if (usersSeeded > 0) {
    console.log('  Demo credentials (password: Demo@1234):');
    DEMO_USERS.forEach(u => console.log(`    ${u.role.padEnd(10)} → ${u.email}`));
  }
  console.log('========================================\n');

  await disconnectDatabase();
  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed] Fatal error during seeding:', err);
  disconnectDatabase().finally(() => process.exit(1));
});
