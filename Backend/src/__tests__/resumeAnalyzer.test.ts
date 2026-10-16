import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  extractSkillsFromText,
  calculateATSScore,
  extractResumeText,
  normalizeSkillName,
} from '../utils/resumeAnalyzer';
import { AppError } from '../middleware/error.middleware';

describe('Resume Analyzer & ATS Scoring Engine', () => {
  describe('Skill Extraction and Aliases', () => {
    it('should correctly extract canonical skills from plain text', () => {
      const text = `
        Senior Software Engineer with 5 years experience in React, TypeScript, Node.js, and MongoDB.
        Experienced with Docker, AWS cloud deployments, and CI/CD pipelines.
      `;
      const skills = extractSkillsFromText(text);

      expect(skills).toContain('React');
      expect(skills).toContain('TypeScript');
      expect(skills).toContain('Node.js');
      expect(skills).toContain('MongoDB');
      expect(skills).toContain('Docker');
      expect(skills).toContain('AWS');
      expect(skills).toContain('CI/CD');
    });

    it('should resolve informal aliases to canonical skill names', () => {
      const text = 'Built web applications using js, ts, reactjs, nodejs, k8s, and mongo.';
      const skills = extractSkillsFromText(text);

      expect(skills).toContain('JavaScript');
      expect(skills).toContain('TypeScript');
      expect(skills).toContain('React');
      expect(skills).toContain('Node.js');
      expect(skills).toContain('Kubernetes');
      expect(skills).toContain('MongoDB');
    });

    it('should not match partial words as skills (boundary check)', () => {
      const text = 'A good person catching fish with outgoing personality and json data.';
      const skills = extractSkillsFromText(text);

      // 'good' should not trigger 'Go'
      expect(skills).not.toContain('Go');
      // 'catching' should not trigger 'C'
      expect(skills).not.toContain('C');
      // 'json' should not trigger 'JavaScript' or 'JS'
      expect(skills).not.toContain('JavaScript');
    });

    it('should normalize skill names accurately', () => {
      expect(normalizeSkillName('reactjs')).toBe('React');
      expect(normalizeSkillName('ts')).toBe('TypeScript');
      expect(normalizeSkillName('mongo')).toBe('MongoDB');
      expect(normalizeSkillName('golang')).toBe('Go');
      expect(normalizeSkillName('UnknownSkill')).toBe('UnknownSkill');
    });
  });

  describe('ATS Scoring Calculation', () => {
    it('should calculate 100% ATS score when all required and preferred skills match', () => {
      const candidateSkills = ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'];
      const requiredSkills = ['React', 'Node.js', 'TypeScript'];
      const preferredSkills = ['MongoDB', 'AWS'];
      const requirements = ['React experience', 'Node.js backend'];
      const text =
        'Expert with React experience and Node.js backend development, TypeScript, MongoDB, and AWS.';

      const result = calculateATSScore(
        text,
        candidateSkills,
        requiredSkills,
        preferredSkills,
        requirements
      );

      expect(result.score).toBe(100);
      expect(result.missingSkills).toHaveLength(0);
      expect(result.matchedSkills).toEqual(
        expect.arrayContaining(['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'])
      );
      expect(result.breakdown.requiredCoveragePercent).toBe(100);
    });

    it('should detect missing skills and compute partial score accurately', () => {
      const candidateSkills = ['React', 'HTML', 'CSS'];
      const requiredSkills = ['React', 'Node.js', 'TypeScript', 'MongoDB'];
      const preferredSkills = ['Docker'];
      const text = 'Frontend developer proficient in React, HTML, and CSS.';

      const result = calculateATSScore(text, candidateSkills, requiredSkills, preferredSkills, []);

      // 1 out of 4 required matched = 25% coverage
      expect(result.breakdown.requiredCoveragePercent).toBe(25);
      expect(result.missingSkills).toEqual(['Node.js', 'TypeScript', 'MongoDB']);
      expect(result.score).toBeLessThan(50);
      expect(result.explanation).toContain('Missing key required skills');
    });

    it('should handle jobs with empty preferred skills and requirements safely', () => {
      const candidateSkills = ['Java', 'Spring Boot'];
      const requiredSkills = ['Java', 'Spring Boot'];

      const result = calculateATSScore(
        'Java and Spring Boot developer',
        candidateSkills,
        requiredSkills,
        [],
        []
      );

      expect(result.score).toBe(100);
      expect(result.missingSkills).toHaveLength(0);
      expect(result.breakdown.preferredSkillsTotal).toBe(0);
    });

    it('should return 0 score when no required skills are matched', () => {
      const candidateSkills = ['Python', 'Django'];
      const requiredSkills = ['C#', 'ASP.NET', 'SQL'];

      const result = calculateATSScore('Python Django developer', candidateSkills, requiredSkills);

      expect(result.score).toBe(0);
      expect(result.breakdown.requiredCoveragePercent).toBe(0);
      expect(result.missingSkills).toEqual(['C#', 'ASP.NET', 'SQL']);
    });
  });

  describe('Resume Text Extraction', () => {
    let tempTxtFile: string;

    beforeEach(async () => {
      tempTxtFile = path.join(os.tmpdir(), `test-resume-${Date.now()}.txt`);
    });

    afterEach(async () => {
      if (fs.existsSync(tempTxtFile)) {
        await fs.promises.unlink(tempTxtFile);
      }
    });

    it('should extract text from a valid UTF-8 text resume', async () => {
      const sampleContent =
        'Full Stack Developer with 4 years of experience building modern web apps with TypeScript and React.';
      await fs.promises.writeFile(tempTxtFile, sampleContent, 'utf-8');

      const extracted = await extractResumeText(tempTxtFile, 'text/plain');
      expect(extracted).toContain('Full Stack Developer');
      expect(extracted).toContain('TypeScript');
    });

    it('should reject empty files with a descriptive error', async () => {
      await fs.promises.writeFile(tempTxtFile, '', 'utf-8');

      await expect(extractResumeText(tempTxtFile, 'text/plain')).rejects.toThrow(AppError);
      await expect(extractResumeText(tempTxtFile, 'text/plain')).rejects.toThrow('empty');
    });

    it('should reject non-existent files', async () => {
      const nonExistent = path.join(os.tmpdir(), 'non-existent-resume.txt');
      await expect(extractResumeText(nonExistent)).rejects.toThrow('was not found on server disk');
    });

    it('should reject files with insufficient readable text', async () => {
      await fs.promises.writeFile(tempTxtFile, 'Short', 'utf-8');

      await expect(extractResumeText(tempTxtFile, 'text/plain')).rejects.toThrow(
        'insufficient readable text'
      );
    });

    it('should reject invalid document extensions', async () => {
      const invalidFile = path.join(os.tmpdir(), `test-${Date.now()}.exe`);
      await fs.promises.writeFile(
        invalidFile,
        'Binary content placeholder test string long enough',
        'utf-8'
      );

      await expect(extractResumeText(invalidFile)).rejects.toThrow('Unsupported document format');

      if (fs.existsSync(invalidFile)) {
        await fs.promises.unlink(invalidFile);
      }
    });
  });
});
