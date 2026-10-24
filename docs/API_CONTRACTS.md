# API Contracts & Interface Specification

This document provides the authoritative, verified interface contracts for the AWT CEC Job Recruitment Platform backend API. All endpoints are hosted under `/api` and have been verified against the Phase 1 & Phase 2 architecture.

---

## 📑 General Information

- **Base URL (Local)**: `http://localhost:5000/api`
- **Root Status URL**: `http://localhost:5000/`
- **Content Type**: `application/json` (except file upload endpoints which use `multipart/form-data`)
- **Pagination Standard**: Defaults to `page=1`, `limit=10` (max limit: 100). Returns `pagination: { total, page, limit, totalPages }`.
- **Database Availability**: All database-backed endpoints verify MongoDB connectivity via `requireDb` middleware and return `503 Service Unavailable` with standardized JSON if disconnected.

### Standard Response Formats

#### Success (Single Resource)
```json
{
  "success": true,
  "message": "Optional descriptive success message",
  "data": { ... }
}
```

#### Success (Paginated List)
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Client / Server Error
```json
{
  "success": false,
  "message": "Descriptive human-readable error explanation",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address."
    }
  ]
}
```

---

## 1. System Endpoints

### 1.1 Root Status
- **Method & Path**: `GET /`
- **Purpose**: Verify backend service liveness and discover health endpoint.
- **Auth**: Public
- **Request**: None
- **Response**: `200 OK`
```json
{
  "message": "College Group Project Backend API is running.",
  "healthCheck": "/api/health"
}
```

### 1.2 Health Check & Diagnostics
- **Method & Path**: `GET /api/health`
- **Purpose**: Check service health, uptime, environment, and MongoDB connection status.
- **Auth**: Public
- **Request**: None
- **Response**: `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2026-10-24T14:30:00.000Z",
  "uptime": 142.5,
  "environment": "development",
  "service": "college-project-backend",
  "database": {
    "status": "connected",
    "ready": true
  }
}
```

---

## 2. Job Recruitment Endpoints (`/api/jobs`)

### 2.1 List Jobs
- **Method & Path**: `GET /api/jobs`
- **Purpose**: Retrieve paginated list of job openings with optional search and filters.
- **Auth**: Public
- **Query Parameters**:
  - `page` (optional integer >= 1, default: `1`)
  - `limit` (optional integer 1–100, default: `10`)
  - `search` (optional string, max: 100 characters, matches title, company, description, skills)
  - `status` (optional enum: `'open'` | `'closed'`)
  - `employmentType` (optional enum: `'full-time'` | `'part-time'` | `'contract'` | `'internship'` | `'remote'`)
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "671a2b3c4d5e6f7a8b9c0d1e",
      "id": "671a2b3c4d5e6f7a8b9c0d1e",
      "title": "Senior Full Stack Engineer",
      "company": "TechCorp Global",
      "location": "San Francisco, CA (Hybrid)",
      "employmentType": "full-time",
      "requiredSkills": ["TypeScript", "React", "Node.js", "MongoDB"],
      "preferredSkills": ["Docker", "AWS", "Tailwind CSS"],
      "requirements": ["3+ years professional experience", "Strong system design skills"],
      "responsibilities": ["Lead architectural reviews", "Build scalable microservices"],
      "salaryRange": {
        "min": 120000,
        "max": 160000,
        "currency": "USD"
      },
      "status": "open",
      "description": "Lead the design and development of next-generation enterprise applications.",
      "createdAt": "2026-10-24T10:00:00.000Z",
      "updatedAt": "2026-10-24T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2.2 Get Single Job by ID
- **Method & Path**: `GET /api/jobs/:id`
- **Purpose**: Retrieve full details of a specific job posting.
- **Auth**: Public
- **Path Parameters**:
  - `id` (required 24-character hexadecimal MongoDB ObjectId)
- **Responses**:
  - `200 OK`: Job details returned in `data`.
  - `400 Bad Request`: Malformed ObjectId format.
  - `404 Not Found`: Job ID does not exist in database.

### 2.3 Create Job Posting
- **Method & Path**: `POST /api/jobs`
- **Purpose**: Create a new recruitment opening.
- **Auth**: Recruiter-only *(Local development: Open; Production requirement: JWT recruiter role)*.
- **Request Body (JSON)**:
```json
{
  "title": "Backend Software Engineer",
  "company": "Apex Cloud Systems",
  "description": "Design and optimize high-throughput REST APIs and data processing pipelines.",
  "location": "Remote",
  "employmentType": "full-time",
  "requiredSkills": ["Node.js", "Express", "TypeScript", "PostgreSQL"],
  "preferredSkills": ["Redis", "Docker", "Kubernetes"],
  "requirements": ["BS in Computer Science or equivalent", "2+ years API development"],
  "responsibilities": ["Build resilient web services", "Write automated tests"],
  "salaryRange": {
    "min": 95000,
    "max": 135000,
    "currency": "USD"
  },
  "status": "open"
}
```
- **Responses**:
  - `201 Created`:
```json
{
  "success": true,
  "message": "Job posting created successfully.",
  "data": { ... }
}
```
  - `400 Bad Request`: Validation failure (missing required title/skills, invalid salary range).

### 2.4 Update Job Posting
- **Method & Path**: `PUT /api/jobs/:id`
- **Purpose**: Update fields on an existing job posting.
- **Auth**: Recruiter-only.
- **Path Parameters**: `id` (24-char ObjectId)
- **Request Body (JSON)**: At least one field required:
```json
{
  "status": "closed",
  "salaryRange": {
    "min": 100000,
    "max": 140000,
    "currency": "USD"
  }
}
```
- **Responses**:
  - `200 OK`: Updated job object returned.
  - `400 Bad Request`: Empty update payload or invalid fields.
  - `404 Not Found`: Job does not exist.

### 2.5 Delete Job Posting
- **Method & Path**: `DELETE /api/jobs/:id`
- **Purpose**: Permanently delete a job opening and cascade-delete associated candidate applications.
- **Auth**: Recruiter-only.
- **Path Parameters**: `id` (24-char ObjectId)
- **Responses**:
  - `200 OK`:
```json
{
  "success": true,
  "message": "Job posting deleted successfully.",
  "data": {
    "id": "671a2b3c4d5e6f7a8b9c0d1e",
    "title": "Backend Software Engineer"
  }
}
```
  - `404 Not Found`: Job does not exist.

---

## 3. Candidate & Application Endpoints (`/api/candidates`)

### 3.1 Submit Candidate Application
- **Method & Path**: `POST /api/candidates/apply` *(Alias: `POST /api/candidates/upload`)*
- **Purpose**: Candidate applies to an open job opening with their resume file. Extracts text, matches skills, computes ATS score, and stores the application in MongoDB.
- **Auth**: Public Candidate Workflow
- **Request Format**: `multipart/form-data`
- **Form Fields**:
  - `resume` (file, required): `.pdf`, `.docx`, or `.txt` (max 5 MB).
  - `name` (string, required): Candidate's full name (2–100 characters).
  - `email` (string, required): Valid email address.
  - `phone` (string, optional): Phone number (max 25 characters).
  - `jobId` (string, required): 24-character hexadecimal ID of target job.
  - `notes` (string, optional): Candidate introductory note (max 2000 chars).
- **Responses**:
  - `201 Created`:
```json
{
  "success": true,
  "message": "Application submitted successfully. Resume parsed and ATS score generated.",
  "data": {
    "_id": "671a3c4d5e6f7a8b9c0d1e2f",
    "id": "671a3c4d5e6f7a8b9c0d1e2f",
    "name": "Jane Candidate",
    "email": "jane.candidate@example.com",
    "phone": "+1 (555) 019-2834",
    "job": "671a2b3c4d5e6f7a8b9c0d1e",
    "resume": {
      "originalName": "Jane_Resume.pdf",
      "fileName": "resume-1729780000000-a1b2c3d4e5f6.pdf",
      "fileSize": 145020,
      "mimeType": "application/pdf",
      "uploadedAt": "2026-10-24T14:35:00.000Z"
    },
    "extractedSkills": ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Git"],
    "atsScore": 92,
    "matchedSkills": ["React", "TypeScript", "Node.js", "MongoDB"],
    "missingSkills": [],
    "applicationStatus": "pending",
    "notes": "Eager to apply my full-stack expertise to your cloud systems team.",
    "createdAt": "2026-10-24T14:35:00.000Z",
    "updatedAt": "2026-10-24T14:35:00.000Z"
  }
}
```
  - `400 Bad Request`: Missing file, unreadable file (<20 chars text), or applied job is closed.
  - `404 Not Found`: Target job ID not found.
  - `409 Conflict`: Duplicate application — candidate with this email has already applied to this job.

### 3.2 List All Candidates
- **Method & Path**: `GET /api/candidates`
- **Purpose**: Retrieve candidates across all jobs, ranked by ATS score and creation date.
- **Auth**: Recruiter-only.
- **Query Parameters**:
  - `page` (optional integer >= 1, default: `1`)
  - `limit` (optional integer 1–100, default: `10`)
  - `jobId` (optional 24-char ObjectId)
  - `status` (optional enum: `'pending'` | `'shortlisted'` | `'rejected'` | `'hired'`)
- **Response**: `200 OK` (includes populated `job: { title, company, status, location }`).

### 3.3 Get Candidate Details by ID
- **Method & Path**: `GET /api/candidates/:id`
- **Purpose**: Retrieve single candidate profile, resume metadata, and ATS scoring breakdown.
- **Auth**: Public Reference Lookup / Recruiter Review.
- **Path Parameters**: `id` (24-char ObjectId)
- **Response**: `200 OK` with candidate document and populated job details.

### 3.4 Get Candidates for Specific Job
- **Method & Path**: `GET /api/candidates/job/:jobId`
- **Purpose**: Retrieve applicants for a single job opening, ranked in descending order by ATS score.
- **Auth**: Recruiter-only.
- **Path Parameters**: `jobId` (24-char ObjectId)
- **Query Parameters**: `page` (default 1), `limit` (default 20).
- **Response**: `200 OK` paginated list.

### 3.5 Update Candidate Status
- **Method & Path**: `PATCH /api/candidates/:id/status`
- **Purpose**: Update application lifecycle status (`pending` -> `shortlisted` | `rejected` | `hired`).
- **Auth**: Recruiter-only.
- **Path Parameters**: `id` (24-char ObjectId)
- **Request Body (JSON)**:
```json
{
  "status": "shortlisted"
}
```
- **Responses**:
  - `200 OK`: Updated candidate profile returned.
  - `400 Bad Request`: Invalid status string (must be one of: `pending`, `shortlisted`, `rejected`, `hired`).
  - `404 Not Found`: Candidate record not found.

### 3.6 Update Candidate Notes
- **Method & Path**: `PATCH /api/candidates/:id/notes`
- **Purpose**: Add or update internal recruiter review notes.
- **Auth**: Recruiter-only.
- **Path Parameters**: `id` (24-char ObjectId)
- **Request Body (JSON)**:
```json
{
  "notes": "Candidate performed well in system design screening. Recommended for technical panel interview."
}
```
- **Responses**:
  - `200 OK`: Updated candidate profile.
  - `400 Bad Request`: Notes exceed 2000 characters.
  - `404 Not Found`: Candidate not found.

### 3.7 Update Candidate Profile Details (Reference Parity)
- **Method & Path**: `PATCH /api/candidates/:id`
- **Purpose**: Update candidate contact details, status, or notes.
- **Auth**: Recruiter-only.
- **Path Parameters**: `id` (24-char ObjectId)
- **Request Body (JSON)**: At least one field required:
```json
{
  "phone": "+1 (555) 987-6543",
  "status": "shortlisted",
  "notes": "Contact information updated."
}
```
- **Responses**:
  - `200 OK`: Updated candidate document.
  - `400 Bad Request`: Empty payload or invalid format.
  - `404 Not Found`: Candidate not found.

### 3.8 Delete Candidate Application
- **Method & Path**: `DELETE /api/candidates/:id`
- **Purpose**: Remove a candidate application record from the database.
- **Auth**: Recruiter-only.
- **Path Parameters**: `id` (24-char ObjectId)
- **Responses**:
  - `200 OK`:
```json
{
  "success": true,
  "message": "Candidate application record deleted successfully.",
  "data": {
    "id": "671a3c4d5e6f7a8b9c0d1e2f"
  }
}
```
  - `404 Not Found`: Candidate record not found.

---

## 4. Standalone Resume ATS Analysis (`/api/analyze-resume` & `/api/resumes`)

### 4.1 Analyze Resume Document
- **Method & Path**: `POST /api/analyze-resume` *(Alias: `POST /api/resumes`)*
- **Purpose**: Upload and analyze a resume file against job criteria without storing a candidate record in MongoDB. Designed for interactive candidate self-evaluations and ATS score previews.
- **Auth**: Public Candidate Tool
- **Request Format**: `multipart/form-data`
- **Form Fields**:
  - `resume` (file, required): `.pdf`, `.docx`, or `.txt` (max 5 MB).
  - `jobId` (string, optional): 24-character ObjectId of existing job (if provided, requirements are fetched automatically).
  - `jobTitle` (string, optional): Custom job position title.
  - `requiredSkills` (string or string array, required if no `jobId`): e.g. `["React", "TypeScript", "Node.js"]` or comma-separated string `"React, TypeScript, Node.js"`.
  - `preferredSkills` (string or string array, optional): e.g. `["Docker", "AWS"]`.
  - `requirements` (string or string array, optional): e.g. `["3+ years experience"]`.
- **Responses**:
  - `200 OK`:
```json
{
  "success": true,
  "message": "Resume analyzed successfully.",
  "data": {
    "score": 85,
    "extractedSkills": ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Git"],
    "matchedSkills": ["React", "TypeScript", "Node.js"],
    "missingSkills": ["Docker"],
    "explanation": "ATS Score: 85/100 based on 75% required skill coverage (3/4). Matched 1/2 preferred skills. Missing key required skills: Docker.",
    "breakdown": {
      "requiredSkillsTotal": 4,
      "requiredSkillsMatched": 3,
      "preferredSkillsTotal": 2,
      "preferredSkillsMatched": 1,
      "requiredCoveragePercent": 75
    },
    "jobInfo": {
      "id": "671a2b3c4d5e6f7a8b9c0d1e",
      "title": "Senior Full Stack Engineer",
      "requiredSkills": ["React", "TypeScript", "Node.js", "Docker"],
      "preferredSkills": ["AWS", "Kubernetes"]
    }
  }
}
```
  - `400 Bad Request`: Missing file, unsupported format, or no required skills supplied.

---

## 5. Security & Authentication Requirements

> [!WARNING]
> **Academic Demonstration vs. Public Production Notice**
> The recruiter-only endpoints (`POST /api/jobs`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id`, `GET /api/candidates`, `GET /api/candidates/:id`, `GET /api/candidates/job/:jobId`, `PATCH /api/candidates/:id*`, `DELETE /api/candidates/:id`) are currently unauthenticated to facilitate immediate pairing and demonstration for Phase 3 frontend work.
> 
> **Minimum Requirements Before Public Production Deployment**:
> 1. Authentication Middleware: JWT Bearer token authentication (`Authorization: Bearer <token>`).
> 2. Role-Based Access Control (RBAC): Verify `req.user.role === 'recruiter' | 'admin'` on all mutation and review routes.
> 3. Environment Secret: Define and validate `JWT_SECRET` in `Backend/.env`.
