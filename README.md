# AWT CEC College Group Project — Full-Stack MERN Architecture

A production-ready Full-Stack MERN (MongoDB, Express, React, Node.js) foundational repository designed for a collaborative 4-member development team. Built with strict TypeScript, Vite, Tailwind CSS v4, unified npm workspaces, and pre-configured deployment blueprints for Render.

---

## 📋 System Prerequisites

Ensure all team members have the following installed locally:

- **Node.js**: `v20.x` or higher (verified on `v24.19.0`)
- **npm**: `v10.x` or higher (verified on `11.17.0`)
- **Git**: Installed and configured with your GitHub account
- **MongoDB**: Local MongoDB instance running on `localhost:27017` or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection URI

---

## 📁 Repository Directory Structure

```text
college-group-project/
├── Backend/                        # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts         # MongoDB connection & credential protection
│   │   ├── controllers/            # Request handlers & controllers (future phases)
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts # Centralized error handling
│   │   │   └── notFound.middleware.ts # 404 handler
│   │   ├── models/                 # Mongoose schemas & data models (future phases)
│   │   ├── routes/
│   │   │   ├── health.routes.ts    # Health check router (/api/health)
│   │   │   └── index.ts            # Root API router aggregator
│   │   ├── services/               # Business domain logic (future phases)
│   │   ├── utils/                  # Backend utility helpers
│   │   ├── app.ts                  # Express application setup & middleware
│   │   └── server.ts               # Server bootstrap, DB connection & shutdown
│   ├── .env.example                # Backend environment variable template
│   ├── .gitignore                  # Backend-specific ignore rules
│   ├── eslint.config.mjs           # Backend ESLint + TypeScript flat configuration
│   ├── package.json                # Backend dependencies & npm scripts
│   └── tsconfig.json               # Backend TypeScript configuration
├── Frontend/                       # React 19 + Vite + TypeScript Frontend
│   ├── public/
│   │   └── favicon.svg             # Application favicon
│   ├── src/
│   │   ├── assets/                 # Images, SVGs, and brand assets
│   │   ├── components/             # Reusable UI components (future phases)
│   │   ├── hooks/                  # Custom React hooks (future phases)
│   │   ├── layouts/                # Page layout wrappers (future phases)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx        # Diagnostics & architecture overview
│   │   │   └── NotFoundPage.tsx    # 404 error page
│   │   ├── routes/
│   │   │   └── AppRoutes.tsx       # React Router client route definitions
│   │   ├── services/
│   │   │   └── api.ts              # Centralized Axios client & API endpoints
│   │   ├── types/                  # Shared TypeScript interfaces & types
│   │   ├── utils/                  # Frontend helper utilities
│   │   ├── App.tsx                 # Root application component
│   │   ├── index.css               # Global styles & Tailwind CSS v4 entry
│   │   └── main.tsx                # React DOM root entry point
│   ├── .env.example                # Frontend environment variable template
│   ├── .gitignore                  # Frontend-specific ignore rules
│   ├── eslint.config.js            # Frontend ESLint + React flat configuration
│   ├── index.html                  # HTML5 entry with metadata & Google Fonts
│   ├── package.json                # Frontend dependencies & npm scripts
│   ├── tsconfig.app.json           # React application TypeScript settings
│   ├── tsconfig.json               # Frontend root TypeScript references
│   ├── tsconfig.node.json          # Vite configuration TypeScript settings
│   └── vite.config.ts              # Vite bundler + Tailwind v4 plugin configuration
├── .editorconfig                   # Editor standards (spacing, line feeds)
├── .gitignore                      # Global git ignore configuration
├── .prettierrc.json                # Prettier code formatting rules
├── package.json                    # Monorepo root workspace configuration & scripts
├── render.yaml                     # Render Infrastructure as Code Blueprint
└── README.md                       # Team guide & project documentation
```

---

## 🚀 Quickstart & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/OMTHAKKAR8495/team-project-of-awt-cec.git
cd team-project-of-awt-cec
```

### 2. Install All Dependencies

Install dependencies across root, Frontend, and Backend in one single command using npm workspaces:

```bash
npm install
```

### 3. Configure Environment Variables

#### Backend Configuration

Copy the template file to `.env`:

```bash
# On Windows PowerShell
cp Backend/.env.example Backend/.env

# Or manually copy Backend/.env.example to Backend/.env
```

Open `Backend/.env` and review the configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/college_group_project
FRONTEND_URL=http://localhost:5173
```

_(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string)._

#### Frontend Configuration

Copy the template file to `.env`:

```bash
# On Windows PowerShell
cp Frontend/.env.example Frontend/.env

# Or manually copy Frontend/.env.example to Frontend/.env
```

Open `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Running the Applications

### Run Both Applications Concurrently (Recommended)

From the repository root:

```bash
npm run dev
```

This runs the Express API on port `5000` and the Vite dev server on port `5173` concurrently with color-coded terminal output.

### Run Applications Individually

#### Frontend Only:

```bash
# From repository root
npm run dev:frontend

# Or from within the Frontend folder
cd Frontend
npm run dev
```

- Local URL: **`http://localhost:5173`**

#### Backend Only:

```bash
# From repository root
npm run dev:backend

# Or from within the Backend folder
cd Backend
npm run dev
```

- Local URL: **`http://localhost:5000`**
- Health Check URL: **`http://localhost:5000/api/health`**

---

## 🛠️ Build, Lint, and Quality Scripts

All commands can be executed from the repository root:

| Command                | Action                                                                     |
| :--------------------- | :------------------------------------------------------------------------- |
| `npm run dev`          | Run Backend and Frontend concurrently                                      |
| `npm run build`        | Build production bundles for both Backend (`dist/`) and Frontend (`dist/`) |
| `npm run lint`         | Run ESLint checks on both Frontend and Backend                             |
| `npm run type-check`   | Run strict TypeScript compiler verification without emitting files         |
| `npm run format`       | Auto-format all code using Prettier                                        |
| `npm run format:check` | Verify code formatting compliance                                          |

---

## 📡 Verifying the Health Check Endpoint

When the backend is running, verify the health status using any tool:

### 1. In Your Browser

Navigate to: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 2. Using cURL

```bash
curl http://localhost:5000/api/health
```

### 3. Using the Frontend UI

1. Start both servers via `npm run dev`.
2. Visit [http://localhost:5173](http://localhost:5173).
3. Click the **"Ping Health Endpoint"** button in the diagnostics card.
4. The card will display the live round-trip latency, database connection status, uptime, and the JSON payload.

Expected JSON response format:

```json
{
  "status": "ok",
  "timestamp": "2026-10-16T06:15:00.000Z",
  "uptime": 12.34,
  "environment": "development",
  "service": "college-group-project-api",
  "database": {
    "status": "connected",
    "ready": true
  }
}
```

---

## ☁️ Deployment Guide (Render)

This repository includes a production-ready `render.yaml` blueprint defining two interconnected services:

1. **`college-project-backend`**: Node.js Web Service running the compiled Express server.
2. **`college-project-frontend`**: Static Site hosting the compiled Vite React SPA with automatic SPA rewrites (`/*` -> `/index.html`).

### Steps to Deploy on Render:

1. Push your repository to GitHub.
2. Sign in to [Render Dashboard](https://dashboard.render.com).
3. Click **"New"** → **"Blueprint"**.
4. Select your GitHub repository (`team-project-of-awt-cec`).
5. Render will detect `render.yaml` and configure both services automatically.
6. Provide the required production environment variables in the Render Dashboard:
   - For **`college-project-backend`**:
     - `MONGODB_URI`: Your production MongoDB Atlas connection string.
     - `FRONTEND_URL`: The URL assigned to your deployed frontend (e.g., `https://college-project-frontend.onrender.com`).
   - For **`college-project-frontend`**:
     - `VITE_API_URL`: The URL assigned to your deployed backend plus `/api` (e.g., `https://college-project-backend.onrender.com/api`).
7. Click **"Apply"** to deploy.

---

## 🚀 Phase 2 — Backend API, Data Models & ATS Scoring Engine

### 1. Data Models

#### A. Job Model (`Backend/src/models/Job.ts`)

- **`title`**: String (2-150 characters, indexed)
- **`company`**: String (2-100 characters, indexed)
- **`description`**: String (min 10 characters)
- **`location`**: String (e.g., 'Remote', 'New York, NY')
- **`employmentType`**: Enum (`'full-time' | 'part-time' | 'contract' | 'internship' | 'remote'`)
- **`requiredSkills`**: Array of strings (min 1, indexed)
- **`preferredSkills`**: Array of strings (optional)
- **`requirements`**: Array of requirement bullet points / descriptions
- **`responsibilities`**: Array of responsibility strings
- **`salaryRange`**: Object `{ min?: number, max?: number, currency: string }`
- **`status`**: Enum (`'open' | 'closed'`), default `'open'`
- **`timestamps`**: `createdAt`, `updatedAt`

#### B. Candidate Model (`Backend/src/models/Candidate.ts`)

- **`name`**: String (2-100 characters)
- **`email`**: String (lowercase, email regex format)
- **`phone`**: String (optional)
- **`job`**: ObjectId (reference to `Job`, indexed)
- **`resume`**: Metadata object (`originalName`, `fileName`, `fileSize`, `mimeType`, `uploadedAt`)
- **`extractedSkills`**: Array of canonical skill strings identified in resume text
- **`atsScore`**: Number (0-100 score, indexed for ranking)
- **`matchedSkills`**: Array of skills matching job requirements
- **`missingSkills`**: Array of required skills not found in resume
- **`applicationStatus`**: Enum (`'pending' | 'shortlisted' | 'rejected' | 'hired'`)
- **`notes`**: Recruiter notes (max 2000 characters)
- **Unique Constraint**: Compound index `{ job: 1, email: 1 }` strictly prevents duplicate submissions for the same position.

---

### 2. API Endpoints

#### Jobs API (`/api/jobs`)

| Method   | Endpoint        | Description                                                                                                    |
| :------- | :-------------- | :------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/jobs`     | List jobs with pagination (`page`, `limit`), search query (`search`), and filters (`status`, `employmentType`) |
| `GET`    | `/api/jobs/:id` | Retrieve single job by ID                                                                                      |
| `POST`   | `/api/jobs`     | Create a job posting (validated with Zod)                                                                      |
| `PUT`    | `/api/jobs/:id` | Update an existing job (validated with Zod)                                                                    |
| `DELETE` | `/api/jobs/:id` | Delete a job posting                                                                                           |

#### Candidates API (`/api/candidates`)

| Method  | Endpoint                     | Description                                                                                                         |
| :------ | :--------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `POST`  | `/api/candidates/apply`      | Submit job application with resume file (multipart/form-data: `resume`, `name`, `email`, `phone`, `jobId`, `notes`) |
| `GET`   | `/api/candidates`            | List candidates with pagination and optional `jobId` / `status` filter                                              |
| `GET`   | `/api/candidates/:id`        | Get details of a single candidate application                                                                       |
| `GET`   | `/api/candidates/job/:jobId` | Retrieve applicants for a specific job ranked by ATS score                                                          |
| `PATCH` | `/api/candidates/:id/status` | Update candidate status (`pending`, `shortlisted`, `rejected`, `hired`)                                             |
| `PATCH` | `/api/candidates/:id/notes`  | Update recruiter notes                                                                                              |

#### Resume Analysis API (`/api/analyze-resume`)

| Method | Endpoint              | Description                                                                                                         |
| :----- | :-------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `POST` | `/api/analyze-resume` | Upload resume file and evaluate ATS match against job ID or explicit skill arrays without creating candidate record |

---

### 3. Resume Upload Rules & Document Processing

- **Supported Formats**: `.pdf`, `.docx`, and `.txt` files.
- **Maximum File Size**: 5 MB (enforced by Multer and verified on disk).
- **Validation**: Checks file extensions, MIME types, and binary file signatures (`%PDF-` header for PDF, PK zip header for DOCX).
- **Storage & Privacy**: Uploads are stored in a non-public folder outside web access. Resumes are parsed in memory / temporary disk and deleted immediately after processing (`cleanupFile`).
- **Scanned Document Disclaimer**: Text extraction requires embedded machine-readable text. Scanned image PDFs requiring Optical Character Recognition (OCR) are not supported without dedicated OCR engines (e.g. Tesseract).

---

### 4. Deterministic ATS Scoring Heuristic & Formula

The ATS scoring engine computes a transparent 0-100 score using an explicit canonical skill dictionary and alias mapping (e.g., `js` → `JavaScript`, `ts` → `TypeScript`, `k8s` → `Kubernetes`):

1. **Required Skill Coverage (70% weight)**:  
   $$\text{Score}_{\text{required}} = \left(\frac{\text{Matched Required Skills}}{\text{Total Required Skills}}\right) \times 70$$
2. **Preferred Skill Match (20% weight)**:  
   $$\text{Score}_{\text{preferred}} = \left(\frac{\text{Matched Preferred Skills}}{\text{Total Preferred Skills}}\right) \times 20$$
3. **Keyword & Requirement Alignment (10% weight)**:  
   $$\text{Score}_{\text{keywords}} = \left(\frac{\text{Matched Requirement Phrases}}{\text{Total Requirements}}\right) \times 10$$
   _(Note: Weights automatically rebalance to 100% required skills if preferred skills or extra requirements are omitted)._

---

### 5. Recruiter Security & Production Considerations

- **Recruiter Authentication Notice**: Recruiter-only endpoints (`POST /api/jobs`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id`, `GET /api/candidates`, `GET /api/candidates/:id`, `GET /api/candidates/job/:jobId`, `PATCH /api/candidates/:id/status`, `PATCH /api/candidates/:id/notes`) are currently unauthenticated for local academic development and project demonstration. These endpoints are **strictly unsuitable for public production deployment** without integrating an authentication and role-based access control layer (such as JWT or OAuth).
- **Ephemeral Resume Retention Policy**: Uploaded resume files (`.pdf`, `.docx`, `.txt`) are processed ephemerally. The file is temporarily stored on server disk during text extraction and ATS skill matching, and is immediately deleted in a `finally` block on both successful processing and on all error paths (including request validation failures and parser errors). Candidate resume metadata (original filename, generated filename, size, MIME type, upload timestamp) and extracted skill analysis are retained in MongoDB. **Original resume binary documents cannot be downloaded after analysis.**

---

## 👥 4-Member Team Collaboration & Git Workflow

To maintain code quality and prevent merge conflicts across four developers, adhere to the following workflow:

### 1. Feature Branch Rule

**Never commit directly to the `main` branch.** Every feature, fix, or update must be developed on an isolated branch.

Naming convention:

- Features: `feature/student-name-feature-description`
- Bug fixes: `fix/student-name-bug-description`
- Refactoring: `refactor/student-name-scope`

Example:

```bash
git checkout main
git pull origin main
git checkout -b feature/om-auth-foundation
```

### 2. Pre-Commit Quality Checks

Before committing your code, always run:

```bash
npm run format
npm run lint
npm run type-check
```

### 3. Commit Message Standards

Use clear and descriptive commit messages following the Conventional Commits pattern:

- `feat: add user schema and validation middleware`
- `fix: resolve cors origin mismatch in production`
- `docs: update setup instructions in readme`

### 4. Pull Requests & Code Reviews

1. Push your branch to GitHub:
   ```bash
   git push -u origin feature/your-branch-name
   ```
2. Open a Pull Request (PR) against `main`.
3. Require at least **1 peer review** from another team member before merging.
4. Verify all automated checks pass on the PR.
5. Merge using **Squash and Merge** to maintain a clean git history on `main`.

---

## 🛡️ Security & Environment Best Practices

- **Never commit `.env` files.** The `.gitignore` files at the root, Frontend, and Backend directories are configured to prevent secrets from leaking.
- Always use `.env.example` as the source of truth for required variable keys.
- In client-side code (`Frontend`), never store sensitive keys, passwords, or database credentials. Vite bundles client code publicly.
