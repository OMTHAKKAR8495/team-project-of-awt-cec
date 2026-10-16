import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { AppError } from '../middleware/error.middleware';

// Dynamic import or class resolution for pdf-parse v2 compatibility
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfModule = require('pdf-parse');

/**
 * Standardized ATS Analysis Result interface
 */
export interface ATSAnalysisResult {
  score: number;
  extractedSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
  breakdown: {
    requiredSkillsTotal: number;
    requiredSkillsMatched: number;
    preferredSkillsTotal: number;
    preferredSkillsMatched: number;
    requiredCoveragePercent: number;
  };
}

/**
 * Explicit canonical skill vocabulary organized by technology area
 */
export const SKILL_VOCABULARY: Record<string, string> = {
  // Programming Languages
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  c: 'C',
  'c++': 'C++',
  'c#': 'C#',
  go: 'Go',
  rust: 'Rust',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  dart: 'Dart',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',

  // Frontend & Backend Frameworks / Libraries
  react: 'React',
  'react native': 'React Native',
  'next.js': 'Next.js',
  vue: 'Vue',
  angular: 'Angular',
  'node.js': 'Node.js',
  express: 'Express',
  nestjs: 'NestJS',
  django: 'Django',
  flask: 'Flask',
  fastapi: 'FastAPI',
  'spring boot': 'Spring Boot',
  'asp.net': 'ASP.NET',
  laravel: 'Laravel',
  'tailwind css': 'Tailwind CSS',
  bootstrap: 'Bootstrap',
  redux: 'Redux',
  graphql: 'GraphQL',

  // Databases & Caches
  mongodb: 'MongoDB',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  sqlite: 'SQLite',
  redis: 'Redis',
  cassandra: 'Cassandra',
  elasticsearch: 'Elasticsearch',
  dynamodb: 'DynamoDB',
  firebase: 'Firebase',

  // Cloud & DevOps / Tooling
  aws: 'AWS',
  azure: 'Azure',
  gcp: 'GCP',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  terraform: 'Terraform',
  ansible: 'Ansible',
  jenkins: 'Jenkins',
  'github actions': 'GitHub Actions',
  'ci/cd': 'CI/CD',
  linux: 'Linux',
  git: 'Git',
  nginx: 'Nginx',

  // Architecture & Concepts
  'rest api': 'REST API',
  microservices: 'Microservices',
  agile: 'Agile',
  scrum: 'Scrum',
  tdd: 'TDD',
  oop: 'OOP',
  'system design': 'System Design',
};

/**
 * Common skill aliases mapping variations to canonical vocabulary keys
 */
export const SKILL_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  golang: 'go',
  reactjs: 'react',
  'react.js': 'react',
  nodejs: 'node.js',
  'node js': 'node.js',
  nextjs: 'next.js',
  expressjs: 'express',
  vuejs: 'vue',
  angularjs: 'angular',
  mongo: 'mongodb',
  postgres: 'postgresql',
  k8s: 'kubernetes',
  cicd: 'ci/cd',
  'ci-cd': 'ci/cd',
  rest: 'rest api',
  restful: 'rest api',
  'rest apis': 'rest api',
  html5: 'html',
  css3: 'css',
  tailwindcss: 'tailwind css',
  tailwind: 'tailwind css',
  'amazon web services': 'aws',
  'google cloud': 'gcp',
  'google cloud platform': 'gcp',
};

/**
 * Escapes regex special characters
 */
const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Resolves any skill name or alias into its canonical display format
 */
export const normalizeSkillName = (inputSkill: string): string => {
  const cleaned = inputSkill.trim().toLowerCase();
  const aliasTarget = SKILL_ALIASES[cleaned] || cleaned;
  return SKILL_VOCABULARY[aliasTarget] || inputSkill.trim();
};

/**
 * Normalizes text content for deterministic keyword matching
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[^\w\s+#./-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extracts skills from raw text using the explicit vocabulary and aliases
 */
export const extractSkillsFromText = (text: string): string[] => {
  const normalized = normalizeText(text);
  const foundSkills = new Set<string>();

  // Helper to check match with proper word boundaries
  const matchTerm = (term: string): boolean => {
    // If term contains special chars like c++, c#, .js, use safe boundary
    const escaped = escapeRegex(term);
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
    return regex.test(normalized);
  };

  // Check aliases first
  for (const [alias, canonicalKey] of Object.entries(SKILL_ALIASES)) {
    if (matchTerm(alias)) {
      foundSkills.add(SKILL_VOCABULARY[canonicalKey]);
    }
  }

  // Check main vocabulary
  for (const [term, displayName] of Object.entries(SKILL_VOCABULARY)) {
    if (matchTerm(term)) {
      foundSkills.add(displayName);
    }
  }

  return Array.from(foundSkills).sort();
};

/**
 * Extracts raw text from PDF, DOCX, or TXT file buffer or disk path
 */
export const extractResumeText = async (
  filePath: string,
  declaredMimeType?: string
): Promise<string> => {
  if (!fs.existsSync(filePath)) {
    throw new AppError(`Uploaded resume file was not found on server disk.`, 400);
  }

  const buffer = await fs.promises.readFile(filePath);
  if (!buffer || buffer.length === 0) {
    throw new AppError('The uploaded resume file is empty (0 bytes).', 400);
  }

  const ext = path.extname(filePath).toLowerCase();
  let text = '';

  try {
    if (ext === '.pdf' || declaredMimeType === 'application/pdf') {
      // Validate PDF signature
      const header = buffer.subarray(0, 5).toString('ascii');
      if (!header.startsWith('%PDF-')) {
        throw new AppError('Invalid PDF file header. The file may be corrupt.', 400);
      }

      // PDFParse v2 class handling with guaranteed resource release in finally block
      let parser: {
        getText: () => Promise<{ text?: string } | string>;
        destroy?: () => Promise<void>;
      } | null = null;
      try {
        if (pdfModule.PDFParse) {
          parser = new pdfModule.PDFParse({ data: buffer });
          const textResult = await parser!.getText();
          text = typeof textResult === 'string' ? textResult : (textResult?.text ?? '');
        } else if (typeof pdfModule === 'function') {
          const result = await pdfModule(buffer);
          text = typeof result === 'string' ? result : (result?.text ?? '');
        } else {
          throw new AppError('PDF extraction library failed to initialize.', 500);
        }
      } finally {
        if (parser && typeof parser.destroy === 'function') {
          try {
            await parser.destroy();
          } catch {
            // Parser cleanup failure ignored
          }
        }
      }
    } else if (
      ext === '.docx' ||
      declaredMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // Validate ZIP signature (DOCX is a zip container)
      const header = buffer.subarray(0, 4);
      if (header[0] !== 0x50 || header[1] !== 0x4b || (header[2] !== 0x03 && header[2] !== 0x05)) {
        throw new AppError('Invalid DOCX document signature. File may be corrupt.', 400);
      }

      const result = await mammoth.extractRawText({ buffer });
      text = result.value || '';
    } else if (ext === '.txt' || declaredMimeType === 'text/plain') {
      text = buffer.toString('utf-8');
    } else {
      throw new AppError(`Unsupported document format '${ext}'. Allowed: .pdf, .docx, .txt`, 400);
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    const msg = error instanceof Error ? error.message : 'Unknown parsing error';
    throw new AppError(`Failed to extract text from resume: ${msg}`, 400);
  }

  const cleanText = text
    .split('')
    .filter(c => {
      const code = c.charCodeAt(0);
      return (code >= 32 && code !== 127) || code === 9 || code === 10 || code === 13;
    })
    .join('')
    .trim();

  if (cleanText.length < 20) {
    throw new AppError(
      'Resume contains insufficient readable text. Note: Scanned image PDFs requiring OCR are not supported without OCR tooling.',
      400
    );
  }

  return cleanText;
};

/**
 * Calculates deterministic ATS score comparing resume skills/text against job requirements
 */
export const calculateATSScore = (
  resumeText: string,
  candidateSkills: string[],
  requiredSkills: string[],
  preferredSkills: string[] = [],
  requirements: string[] = []
): ATSAnalysisResult => {
  // Normalize all skill names for uniform comparison
  const normalizedCandidateSkills = candidateSkills.map(s => normalizeSkillName(s));
  const candidateSkillSet = new Set(normalizedCandidateSkills.map(s => s.trim().toLowerCase()));

  // Analyze Required Skills
  const normalizedRequired = requiredSkills.map(s => normalizeSkillName(s));
  const matchedRequired: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of normalizedRequired) {
    const key = skill.trim().toLowerCase();
    if (candidateSkillSet.has(key)) {
      matchedRequired.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  // Analyze Preferred Skills
  const normalizedPreferred = preferredSkills.map(s => normalizeSkillName(s));
  const matchedPreferred: string[] = [];

  for (const skill of normalizedPreferred) {
    const key = skill.trim().toLowerCase();
    if (candidateSkillSet.has(key)) {
      matchedPreferred.push(skill);
    }
  }

  // Analyze General Requirements Keywords
  const normalizedResumeText = normalizeText(resumeText);
  let matchedRequirementCount = 0;
  let totalRequirementCount = 0;

  for (const req of requirements) {
    const cleanReq = req.trim().toLowerCase();
    if (cleanReq.length > 2) {
      totalRequirementCount++;
      // Check if requirement keywords or phrases are present in resume
      if (normalizedResumeText.includes(cleanReq)) {
        matchedRequirementCount++;
      }
    }
  }

  // Weight Calculation:
  // Default: 70% required skills, 20% preferred skills, 10% general requirement keywords
  const totalRequired = Math.max(normalizedRequired.length, 1);
  const totalPreferred = normalizedPreferred.length;

  let requiredWeight = 70;
  let preferredWeight = 20;
  let requirementsWeight = 10;

  if (totalPreferred === 0 && totalRequirementCount === 0) {
    requiredWeight = 100;
    preferredWeight = 0;
    requirementsWeight = 0;
  } else if (totalPreferred === 0) {
    requiredWeight = 85;
    preferredWeight = 0;
    requirementsWeight = 15;
  } else if (totalRequirementCount === 0) {
    requiredWeight = 75;
    preferredWeight = 25;
    requirementsWeight = 0;
  }

  const requiredScorePart = (matchedRequired.length / totalRequired) * requiredWeight;
  const preferredScorePart =
    totalPreferred > 0 ? (matchedPreferred.length / totalPreferred) * preferredWeight : 0;
  const requirementScorePart =
    totalRequirementCount > 0
      ? (matchedRequirementCount / totalRequirementCount) * requirementsWeight
      : 0;

  const rawScore = requiredScorePart + preferredScorePart + requirementScorePart;
  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  const requiredCoverage = Math.round((matchedRequired.length / totalRequired) * 100);

  // Construct transparent explanation
  const explanationParts: string[] = [
    `ATS Score: ${finalScore}/100 based on ${requiredCoverage}% required skill coverage (${matchedRequired.length}/${totalRequired}).`,
  ];

  if (totalPreferred > 0) {
    explanationParts.push(`Matched ${matchedPreferred.length}/${totalPreferred} preferred skills.`);
  }

  if (missingSkills.length > 0) {
    explanationParts.push(
      `Missing key required skills: ${missingSkills.slice(0, 4).join(', ')}${missingSkills.length > 4 ? '...' : ''}.`
    );
  } else {
    explanationParts.push('All required skills met or exceeded.');
  }

  const allMatchedSkills = Array.from(new Set([...matchedRequired, ...matchedPreferred])).sort();

  return {
    score: finalScore,
    extractedSkills: candidateSkills,
    matchedSkills: allMatchedSkills,
    missingSkills,
    explanation: explanationParts.join(' '),
    breakdown: {
      requiredSkillsTotal: normalizedRequired.length,
      requiredSkillsMatched: matchedRequired.length,
      preferredSkillsTotal: normalizedPreferred.length,
      preferredSkillsMatched: matchedPreferred.length,
      requiredCoveragePercent: requiredCoverage,
    },
  };
};
