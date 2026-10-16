import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type ApplicationStatus = 'pending' | 'shortlisted' | 'rejected' | 'hired';

export interface IResumeMetadata {
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface ICandidate {
  name: string;
  email: string;
  phone?: string;
  job: Types.ObjectId;
  resume: IResumeMetadata;
  extractedSkills: string[];
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  applicationStatus: ApplicationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICandidateDocument extends ICandidate, Document {}

const ResumeMetadataSchema = new Schema<IResumeMetadata>(
  {
    originalName: { type: String, required: true, trim: true },
    fileName: { type: String, required: true, trim: true },
    fileSize: { type: Number, required: true, min: 0 },
    mimeType: { type: String, required: true, trim: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CandidateSchema = new Schema<ICandidateDocument>(
  {
    name: {
      type: String,
      required: [true, 'Candidate name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long.'],
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Candidate email is required.'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [25, 'Phone number cannot exceed 25 characters.'],
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Applied job ID is required.'],
      index: true,
    },
    resume: {
      type: ResumeMetadataSchema,
      required: [true, 'Resume metadata is required.'],
    },
    extractedSkills: {
      type: [String],
      default: [],
    },
    atsScore: {
      type: Number,
      required: [true, 'ATS score is required.'],
      min: [0, 'ATS score cannot be less than 0.'],
      max: [100, 'ATS score cannot exceed 100.'],
      index: true,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    applicationStatus: {
      type: String,
      enum: {
        values: ['pending', 'shortlisted', 'rejected', 'hired'],
        message: '{VALUE} is not a valid application status.',
      },
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters.'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound unique index prevents duplicate applications for the same job with the same email
CandidateSchema.index({ job: 1, email: 1 }, { unique: true });
CandidateSchema.index({ job: 1, applicationStatus: 1 });
CandidateSchema.index({ atsScore: -1 });

export const Candidate: Model<ICandidateDocument> =
  mongoose.models.Candidate || mongoose.model<ICandidateDocument>('Candidate', CandidateSchema);

export default Candidate;
