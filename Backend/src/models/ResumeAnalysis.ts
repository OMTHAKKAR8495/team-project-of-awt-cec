import { Schema, model, Document, Types } from 'mongoose';
import { GeneralBreakdown } from '../utils/resumeAnalyzer';

export interface IResumeAnalysisDocument extends Document {
  resumeName: string;
  mode: 'job' | 'custom' | 'general';
  job?: Types.ObjectId;
  targetTitle: string;
  score: number;
  extractedSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
  breakdown: Record<string, unknown>;
  generalBreakdown?: GeneralBreakdown;
  strengths: string[];
  recommendations: string[];
  createdAt: Date;
}

const resumeAnalysisSchema = new Schema<IResumeAnalysisDocument>(
  {
    resumeName: { type: String, required: true, trim: true },
    mode: { type: String, enum: ['job', 'custom', 'general'], default: 'job' },
    job: { type: Schema.Types.ObjectId, ref: 'Job' },
    targetTitle: { type: String, default: 'General Resume Quality' },
    score: { type: Number, required: true, min: 0, max: 100 },
    extractedSkills: { type: [String], default: [] },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    explanation: { type: String, default: '' },
    breakdown: { type: Schema.Types.Mixed, default: {} },
    generalBreakdown: { type: Schema.Types.Mixed },
    strengths: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

resumeAnalysisSchema.index({ createdAt: -1 });
resumeAnalysisSchema.index({ score: -1 });

export const ResumeAnalysis = model<IResumeAnalysisDocument>(
  'ResumeAnalysis',
  resumeAnalysisSchema
);
