export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type JobStatus = 'open' | 'closed';

export interface SalaryRange {
  min?: number;
  max?: number;
  currency?: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType: EmploymentType;
  requiredSkills: string[];
  preferredSkills?: string[];
  requirements?: string[];
  responsibilities?: string[];
  salaryRange?: SalaryRange;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobInput {
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType: EmploymentType;
  requiredSkills: string[];
  preferredSkills?: string[];
  requirements?: string[];
  responsibilities?: string[];
  salaryRange?: SalaryRange;
  status?: JobStatus;
}

export type UpdateJobInput = Partial<CreateJobInput>;

export interface JobQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: JobStatus;
  employmentType?: EmploymentType;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface SingleResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
