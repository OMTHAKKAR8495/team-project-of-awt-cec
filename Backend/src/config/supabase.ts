/**
 * Supabase Cloud PostgreSQL Client & Data Access Layer
 * Provides zero-dependency REST integration with Supabase for enterprise data persistence.
 */

export interface SupabaseConfig {
  url: string;
  key: string;
}

export const getSupabaseConfig = (): SupabaseConfig | null => {
  const url = process.env.SUPABASE_URL?.trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)?.trim();

  if (url && key) {
    return { url, key };
  }
  return null;
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig() !== null;
};

let isSupabaseOnline = false;
let healthCheckTimer: NodeJS.Timeout | null = null;

export const isSupabaseReady = (): boolean => isSupabaseOnline;

/**
 * Starts periodic background health check of Supabase connection.
 */
export const startSupabaseHealthCheck = (intervalMs = 30000): void => {
  if (healthCheckTimer || !isSupabaseConfigured()) return;
  healthCheckTimer = setInterval(async () => {
    await checkSupabaseConnection();
  }, intervalMs);
  if (healthCheckTimer && typeof healthCheckTimer.unref === 'function') {
    healthCheckTimer.unref();
  }
};

/**
 * Stops periodic background health check of Supabase connection.
 */
export const stopSupabaseHealthCheck = (): void => {
  if (healthCheckTimer) {
    clearInterval(healthCheckTimer);
    healthCheckTimer = null;
  }
};

/**
 * Tests connection to the Supabase REST endpoint.
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  const config = getSupabaseConfig();
  if (!config) {
    isSupabaseOnline = false;
    return false;
  }

  // Ensure periodic background check is active
  startSupabaseHealthCheck();

  try {
    const res = await fetch(`${config.url}/rest/v1/jobs?select=id&limit=1`, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    });

    isSupabaseOnline = res.ok;
    return res.ok;
  } catch (err) {
    isSupabaseOnline = false;
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[Supabase] Connection test failed: ${msg}`);
    return false;
  }
};

/**
 * Generic Supabase REST API fetch wrapper
 */
export async function supabaseRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error('Supabase credentials (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY) are not configured.');
  }

  const method = options.method || 'GET';
  const headers: Record<string, string> = {
    apikey: config.key,
    Authorization: `Bearer ${config.key}`,
    Accept: 'application/json',
    ...options.headers,
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  let response: Response;
  try {
    response = await fetch(`${config.url}/rest/v1${path}`, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (networkErr) {
    isSupabaseOnline = false;
    throw networkErr;
  }

  if (!response.ok) {
    let errMessage = `Supabase error (${response.status} ${response.statusText})`;
    try {
      const errJson = await response.json();
      if (errJson && (errJson.message || errJson.details || errJson.hint)) {
        errMessage = errJson.message || errJson.details || errJson.hint;
      }
    } catch {
      // safe fallback
    }
    throw new Error(errMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as unknown as T;
  }

  return response.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA MAPPERS (Translates PostgreSQL snake_case to Frontend camelCase)
// ─────────────────────────────────────────────────────────────────────────────

export interface RawSupabaseJob {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  employment_type: string;
  required_skills: string[];
  preferred_skills?: string[];
  requirements?: string[];
  responsibilities?: string[];
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RawSupabaseCandidate {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  job_id: string;
  resume_original_name: string;
  resume_file_name: string;
  resume_file_size: number;
  resume_mime_type: string;
  resume_uploaded_at?: string;
  extracted_skills: string[];
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  application_status: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export function formatSupabaseJob(row: RawSupabaseJob) {
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    company: row.company,
    description: row.description,
    location: row.location,
    employmentType: row.employment_type,
    requiredSkills: row.required_skills || [],
    preferredSkills: row.preferred_skills || [],
    requirements: row.requirements || [],
    responsibilities: row.responsibilities || [],
    salaryRange:
      row.salary_min !== null || row.salary_max !== null
        ? {
            min: row.salary_min !== null ? Number(row.salary_min) : undefined,
            max: row.salary_max !== null ? Number(row.salary_max) : undefined,
            currency: row.salary_currency || 'USD',
          }
        : undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function formatSupabaseCandidate(row: RawSupabaseCandidate, jobRow?: RawSupabaseJob | null) {
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    job: jobRow
      ? {
          _id: jobRow.id,
          id: jobRow.id,
          title: jobRow.title,
          company: jobRow.company,
          location: jobRow.location,
          requiredSkills: jobRow.required_skills || [],
        }
      : row.job_id,
    resume: {
      originalName: row.resume_original_name || 'Resume.pdf',
      fileName: row.resume_file_name || 'Resume.pdf',
      fileSize: row.resume_file_size || 0,
      mimeType: row.resume_mime_type || 'application/pdf',
      uploadedAt: row.resume_uploaded_at || row.created_at,
    },
    extractedSkills: row.extracted_skills || [],
    atsScore: row.ats_score,
    matchedSkills: row.matched_skills || [],
    missingSkills: row.missing_skills || [],
    applicationStatus: row.application_status,
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

