import request from 'supertest';
import path from 'path';
import fs from 'fs';
import os from 'os';
import app from '../app';

describe('Express API Endpoints & Middlewares', () => {
  describe('System Endpoints', () => {
    it('GET / should return 200 with API status information', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Backend API is running');
      expect(res.body.healthCheck).toBe('/api/health');
    });

    it('GET /api/health should return 200 with health metrics', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('database');
      expect(res.body.database).toHaveProperty('status');
    });

    it('GET /undefined-route should return 404 with standardized JSON error', async () => {
      const res = await request(app).get('/api/undefined-endpoint-xyz');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Resource not found');
    });
  });

  describe('Database Connection Protection', () => {
    it('GET /api/jobs should return 503 if MongoDB is disconnected', async () => {
      // In unit test environment, MongoDB is not connected
      const res = await request(app).get('/api/jobs');
      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Database service is unavailable');
    });

    it('GET /api/candidates should return 503 if MongoDB is disconnected', async () => {
      const res = await request(app).get('/api/candidates');
      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Database service is unavailable');
    });
  });

  describe('POST /api/analyze-resume (Standalone Resume Analysis)', () => {
    let sampleResumePath: string;

    beforeEach(async () => {
      sampleResumePath = path.join(os.tmpdir(), `test-resume-${Date.now()}.txt`);
      const sampleText = `
        Jane Developer
        Email: jane@example.com
        Skills: React, TypeScript, Node.js, Express, MongoDB, Docker, Git.
        Experience: 4 years designing full stack web services with React and Node.js.
      `;
      await fs.promises.writeFile(sampleResumePath, sampleText, 'utf-8');
    });

    afterEach(async () => {
      if (fs.existsSync(sampleResumePath)) {
        await fs.promises.unlink(sampleResumePath);
      }
    });

    it('should return 400 when no resume file is attached', async () => {
      const res = await request(app)
        .post('/api/analyze-resume')
        .field('jobTitle', 'Frontend Developer')
        .field('requiredSkills', JSON.stringify(['React', 'TypeScript']));

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Resume file');
    });

    it('should successfully analyze a resume without saving candidate to database', async () => {
      const res = await request(app)
        .post('/api/analyze-resume')
        .attach('resume', sampleResumePath)
        .field('jobTitle', 'Full Stack Developer')
        .field('requiredSkills', JSON.stringify(['React', 'Node.js', 'TypeScript']))
        .field('preferredSkills', JSON.stringify(['Docker', 'AWS']));

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('score');
      expect(res.body.data.score).toBeGreaterThan(0);
      expect(res.body.data.matchedSkills).toContain('React');
      expect(res.body.data.matchedSkills).toContain('Node.js');
      expect(res.body.data.matchedSkills).toContain('TypeScript');
      expect(res.body.data.matchedSkills).toContain('Docker');
      expect(res.body.data.missingSkills).toEqual([]);
      expect(res.body.data).toHaveProperty('explanation');
      expect(res.body.data.jobInfo.title).toBe('Full Stack Developer');
    });

    it('should reject unsupported file extensions', async () => {
      const invalidPath = path.join(os.tmpdir(), `test-invalid-${Date.now()}.sh`);
      await fs.promises.writeFile(invalidPath, '#!/bin/bash\necho hello', 'utf-8');

      const res = await request(app)
        .post('/api/analyze-resume')
        .attach('resume', invalidPath)
        .field('requiredSkills', JSON.stringify(['React']));

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Unsupported');

      if (fs.existsSync(invalidPath)) {
        await fs.promises.unlink(invalidPath);
      }
    });

    it('should clean up uploaded temporary file when request body validation fails', async () => {
      const uploadDir = path.resolve(__dirname, '../../uploads/resumes');
      const filesBefore = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];

      const res = await request(app)
        .post('/api/analyze-resume')
        .attach('resume', sampleResumePath)
        .field('jobTitle', 'Developer')
        // missing requiredSkills will fail body validation
        .field('requiredSkills', '');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);

      const filesAfter = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
      expect(filesAfter.length).toBe(filesBefore.length);
    });

    it('should clean up uploaded temporary file when parser extraction fails', async () => {
      const corruptFile = path.join(os.tmpdir(), `corrupt-${Date.now()}.pdf`);
      // Invalid PDF content lacking %PDF- header
      await fs.promises.writeFile(corruptFile, 'Not a real PDF file but has extension', 'utf-8');

      const uploadDir = path.resolve(__dirname, '../../uploads/resumes');
      const filesBefore = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];

      const res = await request(app)
        .post('/api/analyze-resume')
        .attach('resume', corruptFile)
        .field('jobTitle', 'Engineer')
        .field('requiredSkills', JSON.stringify(['React']));

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);

      const filesAfter = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
      expect(filesAfter.length).toBe(filesBefore.length);

      if (fs.existsSync(corruptFile)) {
        await fs.promises.unlink(corruptFile);
      }
    });
  });

  describe('CORS Configuration & Environment Origin Restrictions', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalFrontendUrl = process.env.FRONTEND_URL;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      process.env.FRONTEND_URL = originalFrontendUrl;
    });

    it('should allow requests from local development origin in non-production mode', async () => {
      process.env.NODE_ENV = 'development';
      const res = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');

      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should restrict origins strictly to FRONTEND_URL in production mode', async () => {
      process.env.NODE_ENV = 'production';
      process.env.FRONTEND_URL = 'https://recruiter-portal.example.com';

      // Configured origin allowed
      const allowedRes = await request(app)
        .get('/api/health')
        .set('Origin', 'https://recruiter-portal.example.com');

      expect(allowedRes.status).toBe(200);
      expect(allowedRes.headers['access-control-allow-origin']).toBe(
        'https://recruiter-portal.example.com'
      );

      // Unconfigured origin rejected with 403 Forbidden
      const rejectedRes = await request(app)
        .get('/api/health')
        .set('Origin', 'https://unauthorized-domain.com');

      expect(rejectedRes.status).toBe(403);
      expect(rejectedRes.body.success).toBe(false);
      expect(rejectedRes.body.message).toContain('not allowed by CORS policy');
    });
  });
});
