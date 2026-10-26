import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  selectedFile,
  label = 'Upload Resume',
  error,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateAndSetFile = (file: File) => {
    setLocalError(null);
    const fileName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

    if (!hasValidExt) {
      setLocalError('Invalid file type. Only .pdf, .docx, and .txt files are accepted.');
      onFileSelect(null);
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setLocalError(`File size exceeds 5 MB limit (${formatFileSize(file.size)}).`);
      onFileSelect(null);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const activeError = error || localError;

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            {label} <span className="text-rose-400">*</span>
          </label>
          <span className="text-[11px] text-slate-500">PDF, DOCX, TXT up to 5MB</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 backdrop-blur-sm ${
            disabled ? 'opacity-60 cursor-not-allowed bg-white/3' : 'bg-white/3 hover:bg-white/5'
          } ${
            isDragOver
              ? 'border-cyan-500 bg-cyan-950/20'
              : activeError
                ? 'border-rose-500/50 hover:border-rose-400'
                : 'border-white/15 hover:border-cyan-500/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-cyan-400 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              <span className="text-cyan-400 font-semibold hover:underline">Click to upload</span>{' '}
              <span className="text-slate-400">or drag and drop</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Maximum file size: 5 MB (.pdf, .docx, .txt)
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {selectedFile.name}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span>{formatFileSize(selectedFile.size)}</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Ready for analysis
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            aria-label="Remove selected resume"
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-500/30"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {activeError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
