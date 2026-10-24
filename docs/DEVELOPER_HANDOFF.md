# Developer Handoff Document — Phases 1 & 2 Finalization

**Project**: AWT CEC Job Recruitment Platform (CareerMatch AI)  
**Team Members**: 4  
**Phases Covered**: Phase 1 (Architecture & Setup) & Phase 2 (Database & Backend APIs)  
**Target Audience**: Team Members delivering Phase 3 (Candidate & Recruiter UI Pages), Phase 4 (Reusable Component Library), and Phase 5 (Client Utilities & Polish).

---

## 1. Verified Project Structure & Startup Commands

The repository is structured as a unified npm workspace with isolated TypeScript configs and independent build pipelines:

```text
team-project-of-awt-cec/
├── Backend/                 # Express, MongoDB, TypeScript, Multer, PDF/DOCX Parsing
│   ├── src/
│   │   ├── config/          # database.ts (Mongoose connection & URI sanitizer), env.ts
│   │   ├── controllers/     # jobController.ts, candidateController.ts, resumeController.ts
│   │   ├── middleware/      # error, notFound, upload, rateLimit, validateRequest
│   │   ├── models/          # Job.ts, Candidate.ts
│   │   ├── routes/          # jobRoutes.ts, candidateRoutes.ts, resumeRoutes.ts, health.routes.ts
│   │   ├── services/        # jobService.ts, candidateService.ts, resumeService.ts
│   │   └── utils/           # resumeAnalyzer.ts, validationSchemas.ts
│   ├── .env.example
│   └── package.json
├── Frontend/                # Vite 6, React 19, Tailwind CSS v4, Lucide Icons, Axios
│   ├── src/
│   │   ├── components/      # Candidate & common components (ApplyModal, FileDropzone, ScoreRing, etc.)
│   │   ├── pages/           # Candidate & Recruiter page views
│   │   ├── services/        # api.ts (Centralized Axios client & API methods)
│   │   ├── types/           # job.ts, candidate.ts, resume.ts
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── API_CONTRACTS.md     # Authoritative HTTP endpoint contracts & schemas
│   └── DEVELOPER_HANDOFF.md # This handoff guide
├── package.json             # Root monorepo workspace scripts
└── render.yaml              # Production cloud infrastructure deployment blueprint
```

### Verified Development & Build Commands

Run all commands from the repository root:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs root, Backend, and Frontend dependencies in one step. |
| `npm run dev` | Concurrently runs Backend (`http://localhost:5000`) and Frontend (`http://localhost:5173`). |
| `npm run dev:backend` | Starts Backend with hot-reloading (`ts-node-dev`). |
| `npm run dev:frontend` | Starts Frontend dev server with Vite HMR. |
| `npm run type-check` | Runs TypeScript compiler verification (`tsc --noEmit`) across both workspaces. |
| `npm run lint` | Runs ESLint across both workspaces. |
| `npm run build` | Compiles production bundles for Backend (`tsc` -> `dist/`) and Frontend (`vite build` -> `dist/`). |
| `npm test` | Runs Backend Jest test suites (`44 tests across 6 suites`). |

---

## 2. Environment Variables Specification

No secrets are hardcoded in source files or committed to Git. Create `.env` files using the verified templates:

### Backend Configuration (`Backend/.env`)
```bash
# Runtime environment ('development' | 'production' | 'test')
NODE_ENV=development

# Port where Express listens (default: 5000)
PORT=5000

# MongoDB Connection String (Local MongoDB or MongoDB Atlas)
# Passwords are automatically masked in server startup logs
MONGODB_URI=mongodb://127.0.0.1:27017/college_group_project

# Allowed frontend origin(s) for CORS in production (comma-separated if multiple)
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration (`Frontend/.env`)
```bash
# Backend API Base URL exposed to Vite client
VITE_API_URL=http://localhost:5000/api
```

---

## 3. Database Models & Application Statuses

### `Job` Model (`Backend/src/models/Job.ts`)
- `title`: String (required, 2-150 chars, trimmed, indexed)
- `company`: String (required, 2-100 chars, trimmed, indexed)
- `description`: String (required, min 10 chars, trimmed)
- `location`: String (required, trimmed)
- `employmentType`: Enum (`'full-time'` | `'part-time'` | `'contract'` | `'internship'` | `'remote'`, default `'full-time'`)
- `requiredSkills`: String[] (required, at least 1 item, indexed)
- `preferredSkills`: String[] (default `[]`)
- `requirements`: String[] (default `[]`)
- `responsibilities`: String[] (default `[]`)
- `salaryRange`: Subdocument `{ min?: number, max?: number, currency?: string }`
- `status`: Enum (`'open'` | `'closed'`, default `'open'`)
- `createdAt` / `updatedAt`: Timestamps (auto-managed)
- **Database Indexes**: Text search index on `{ title, company, description }`; compound index on `{ status, createdAt }`.

### `Candidate` Model (`Backend/src/models/Candidate.ts`)
- `name`: String (required, 2-100 chars, trimmed)
- `email`: String (required, lowercase, trimmed, validated email)
- `phone`: String (optional, max 25 chars)
- `job`: ObjectId (ref: `'Job'`, required, indexed)
- `resume`: Subdocument `{ originalName, fileName, fileSize, mimeType, uploadedAt }`
- `extractedSkills`: String[] (normalized skills detected from resume text)
- `atsScore`: Number (0-100, required, indexed)
- `matchedSkills`: String[] (skills matching job requirements)
- `missingSkills`: String[] (required job skills missing from candidate resume)
- `applicationStatus`: Enum (`'pending'` | `'shortlisted'` | `'rejected'` | `'hired'`, default `'pending'`, indexed)
- `notes`: String (optional recruiter review notes, max 2000 chars)
- `createdAt` / `updatedAt`: Timestamps (auto-managed)
- **Database Indexes**: Compound unique index `{ job: 1, email: 1 }` (strictly prevents duplicate submissions for the same job); compound index `{ job: 1, applicationStatus: 1 }`; index on `{ atsScore: -1 }`.

---

## 4. Resume Analysis & ATS Engine

Located in `Backend/src/utils/resumeAnalyzer.ts`:

### Capabilities
- **File Format Support**: `.pdf`, `.docx`, and `.txt` files up to **5 MB**.
- **Signature Security**: Verifies `%PDF-` magic bytes on PDFs and PK ZIP signatures on DOCX files before parsing.
- **pdf-parse v2 Compatibility**: Utilizes `PDFParse` class with guaranteed `destroy()` cleanup in a `finally` block to prevent open file handle leaks.
- **Skill Vocabulary & Aliases**: Built-in canonical dictionary of 60+ programming languages, frameworks, cloud platforms, and databases, with fuzzy alias resolution (e.g., `k8s` -> `Kubernetes`, `py` -> `Python`, `reactjs` -> `React`).
- **Deterministic ATS Scoring**:
  - 70% weight on required skills coverage.
  - 20% weight on preferred skills coverage.
  - 10% weight on general requirement keyword matches.
  - Generates transparent breakdown and plain-English explanation.
- **Storage Lifecycle & Cleanup**: Multer places files into `Backend/uploads/resumes/`. Files are **guaranteed to be deleted** via `cleanupFile()` in `finally` blocks and error middleware on both successful analysis and unexpected errors.

### Known Limitations
- **No OCR Support**: Scanned image PDFs that lack embedded text will fail with a clear HTTP 400 error: *"Resume contains insufficient readable text. Note: Scanned image PDFs requiring OCR are not supported without OCR tooling."*

---

## 5. Frontend Integration Services (`Frontend/src/services/api.ts`)

Phase 3/4/5 developers should consume all endpoints through the pre-configured `api.ts` module:

```typescript
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyCandidate,
  getCandidates,
  getCandidateById,
  getCandidatesByJob,
  updateCandidateStatus,
  updateCandidateNotes,
  updateCandidate,
  deleteCandidate,
  analyzeResume,
  fetchHealthStatus,
  getErrorMessage
} from '../services/api';
```

---

## 6. Security, Authentication & Deployment Status

1. **Authentication Status**:
   - Recruiter operations (`POST /api/jobs`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id`, candidate status updates and applicant lists) are currently **unauthenticated** to allow open collaboration and academic grading for Phases 3 and 4.
   - **Production Blocker**: Before deploying to a public production environment, JWT authentication and recruiter RBAC middleware must be attached to protected routes.
2. **Search Injection Safety**:
   - User search inputs are length-constrained (max 100 chars) and escaped via `escapeRegex` to prevent ReDoS attacks or regex errors.
3. **Payload Protection**:
   - Express JSON body limit: `2mb`.
   - File upload limit: `5mb` with single-file constraint.
   - Rate limiting: 100 requests / 15 min globally; 10 uploads / 15 min for upload endpoints.
