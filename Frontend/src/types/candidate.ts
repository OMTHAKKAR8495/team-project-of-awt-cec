export type ApplicationStatus = 'pending' | 'shortlisted' | 'rejected' | 'hired';

export interface ResumeMetadata {
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface PopulatedJobSummary {
  _id: string;
  title: string;
  company: string;
  status?: string;
  location?: string;
  requiredSkills?: string[];
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  job: string | PopulatedJobSummary;
  resume: ResumeMetadata;
  extractedSkills: string[];
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  applicationStatus: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateQueryParams {
  page?: number;
  limit?: number;
  jobId?: string;
  status?: ApplicationStatus;
}
