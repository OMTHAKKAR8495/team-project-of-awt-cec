import {
  createJobSchema,
  updateJobSchema,
  jobQuerySchema,
  applyCandidateBodySchema,
  updateCandidateStatusSchema,
  objectIdSchema,
  salaryRangeSchema,
} from '../utils/validationSchemas';

describe('Zod Validation Schemas', () => {
  describe('ObjectId Schema', () => {
    it('should validate valid 24-character hexadecimal MongoDB ObjectIds', () => {
      const validId = '507f1f77bcf86cd799439011';
      expect(objectIdSchema.safeParse(validId).success).toBe(true);
    });

    it('should reject invalid ObjectId strings', () => {
      expect(objectIdSchema.safeParse('12345').success).toBe(false);
      expect(objectIdSchema.safeParse('not-an-id').success).toBe(false);
      expect(objectIdSchema.safeParse('507f1f77bcf86cd79943901Z').success).toBe(false);
    });
  });

  describe('Job Schemas', () => {
    it('should validate a complete, valid job posting payload', () => {
      const validJob = {
        title: 'Senior Frontend Engineer',
        company: 'Acme Corporation',
        description:
          'We are looking for a skilled frontend engineer to build modern web applications.',
        location: 'Remote',
        employmentType: 'full-time',
        requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
        preferredSkills: ['Next.js', 'GraphQL'],
        requirements: [
          '3+ years frontend experience',
          'Proficiency in modern JavaScript/TypeScript',
        ],
        responsibilities: ['Build reusable UI components', 'Collaborate with backend teams'],
        salaryRange: { min: 80000, max: 120000, currency: 'USD' },
        status: 'open',
      };

      const result = createJobSchema.safeParse(validJob);
      expect(result.success).toBe(true);
    });

    it('should reject jobs with missing required fields or empty requiredSkills', () => {
      const missingSkills = {
        title: 'Frontend Engineer',
        company: 'Acme',
        description: 'Short description long enough',
        location: 'Remote',
        requiredSkills: [],
      };
      expect(createJobSchema.safeParse(missingSkills).success).toBe(false);

      const shortTitle = {
        title: 'A',
        company: 'Acme',
        description: 'Valid description longer than 10 chars',
        location: 'Remote',
        requiredSkills: ['React'],
      };
      expect(createJobSchema.safeParse(shortTitle).success).toBe(false);
    });

    it('should validate salary ranges where min <= max', () => {
      expect(salaryRangeSchema.safeParse({ min: 50000, max: 90000, currency: 'USD' }).success).toBe(
        true
      );

      // min > max must fail
      expect(
        salaryRangeSchema.safeParse({ min: 100000, max: 50000, currency: 'USD' }).success
      ).toBe(false);
    });

    it('should reject empty updateJob payloads', () => {
      expect(updateJobSchema.safeParse({}).success).toBe(false);
      expect(updateJobSchema.safeParse({ title: 'New Title' }).success).toBe(true);
    });

    it('should validate job search query parameters and enforce search max length', () => {
      const validQuery = { search: 'React Developer', page: 1, limit: 10 };
      expect(jobQuerySchema.safeParse(validQuery).success).toBe(true);

      const tooLongSearch = { search: 'a'.repeat(101) };
      const failed = jobQuerySchema.safeParse(tooLongSearch);
      expect(failed.success).toBe(false);
      if (!failed.success) {
        expect(failed.error.issues[0].message).toContain('cannot exceed 100 characters');
      }

      const exactMaxLengthSearch = { search: 'a'.repeat(100) };
      expect(jobQuerySchema.safeParse(exactMaxLengthSearch).success).toBe(true);
    });
  });

  describe('Candidate Schemas', () => {
    it('should validate valid candidate application data', () => {
      const payload = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1 555-123-4567',
        jobId: '507f1f77bcf86cd799439011',
        notes: 'Referred by team lead.',
      };

      const result = applyCandidateBodySchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid candidate email or invalid jobId', () => {
      const invalidEmail = {
        name: 'Jane Doe',
        email: 'not-an-email',
        jobId: '507f1f77bcf86cd799439011',
      };
      expect(applyCandidateBodySchema.safeParse(invalidEmail).success).toBe(false);

      const invalidJobId = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        jobId: 'invalid-job-id',
      };
      expect(applyCandidateBodySchema.safeParse(invalidJobId).success).toBe(false);
    });

    it('should validate permitted application statuses', () => {
      expect(updateCandidateStatusSchema.safeParse({ status: 'pending' }).success).toBe(true);
      expect(updateCandidateStatusSchema.safeParse({ status: 'shortlisted' }).success).toBe(true);
      expect(updateCandidateStatusSchema.safeParse({ status: 'rejected' }).success).toBe(true);
      expect(updateCandidateStatusSchema.safeParse({ status: 'hired' }).success).toBe(true);

      expect(updateCandidateStatusSchema.safeParse({ status: 'interviewing' }).success).toBe(false);
      expect(updateCandidateStatusSchema.safeParse({ status: 'unknown' }).success).toBe(false);
    });
  });
});
