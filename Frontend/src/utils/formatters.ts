/**
 * Formats a file size in bytes to a human-readable string.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formats a date string to a readable local date.
 */
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Returns a color class based on ATS score value.
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-cyan-500';
  if (score >= 40) return 'text-amber-500';
  return 'text-rose-500';
};

/**
 * Returns badge color for application status.
 */
export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'hired':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'shortlisted':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    case 'rejected':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    default:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }
};

/**
 * Truncates text to a maximum length with ellipsis.
 */
export const truncate = (text: string, maxLength = 100): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Debounce a function call.
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

