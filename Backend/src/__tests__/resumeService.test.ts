import path from 'path';
import fs from 'fs';
import os from 'os';
import { analyzeUploadedResume } from '../services/resumeService';
import { AppError } from '../middleware/error.middleware';

describe('Resume Service Unit Tests', () => {
  let testFilePath: string;

  beforeEach(async () => {
    testFilePath = path.join(os.tmpdir(), `test-service-resume-${Date.now()}.txt`);
    const content = `
      Alex Candidate
      Senior Engineer with expertise in Python, Docker, Kubernetes, and PostgreSQL.
      Passionate about Microservices and CI/CD pipelines.
    `;
    await fs.promises.writeFile(testFilePath, content, 'utf-8');
  });

  afterEach(async () => {
    if (fs.existsSync(testFilePath)) {
      await fs.promises.unlink(testFilePath);
    }
  });

  it('should successfully analyze a resume and clean up disk file', async () => {
    const result = await analyzeUploadedResume({
      filePath: testFilePath,
      mimeType: 'text/plain',
      jobTitle: 'DevOps Engineer',
      requiredSkills: ['Python', 'Docker', 'Kubernetes'],
      preferredSkills: ['PostgreSQL'],
    });

    expect(result.score).toBeGreaterThan(0);
    expect(result.matchedSkills).toContain('Python');
    expect(result.matchedSkills).toContain('Docker');
    expect(result.matchedSkills).toContain('Kubernetes');
    expect(result.matchedSkills).toContain('PostgreSQL');

    // Confirm file was deleted from disk in finally block
    expect(fs.existsSync(testFilePath)).toBe(false);
  });

  it('should throw an error when required skills are missing', async () => {
    await expect(
      analyzeUploadedResume({
        filePath: testFilePath,
        mimeType: 'text/plain',
        jobTitle: 'Generic Role',
        requiredSkills: [],
      })
    ).rejects.toThrow(AppError);
  });
});
