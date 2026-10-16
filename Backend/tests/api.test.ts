import request from 'supertest';
import app from '../src/app';

describe('API Route Middleware Integration Tests', () => {
  it('should include CORS and JSON response headers on endpoints', async () => {
    const res = await request(app).get('/').set('Origin', 'http://localhost:5173');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.headers['access-control-allow-origin']).toBeDefined();
  });

  it('should reject invalid JSON payloads with a clean 400 error', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Content-Type', 'application/json')
      .send('{"invalidJson: }');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
