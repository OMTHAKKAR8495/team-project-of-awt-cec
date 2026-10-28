import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type JobStatus = 'open' | 'closed';

export interface ISalaryRange {
  min?: number;
  max?: number;
  currency?: string;
}

export interface IJob {
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType: EmploymentType;
  requiredSkills: string[];
  preferredSkills?: string[];
  requirements?: string[];
  responsibilities?: string[];
  salaryRange?: ISalaryRange;
  status: JobStatus;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobDocument extends IJob, Document {}

const SalaryRangeSchema = new Schema<ISalaryRange>(
  {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, default: 'USD', uppercase: true, trim: true },
  },
  { _id: false }
);

const JobSchema = new Schema<IJobDocument>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required.'],
      trim: true,
      minlength: [2, 'Job title must be at least 2 characters long.'],
      maxlength: [150, 'Job title cannot exceed 150 characters.'],
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required.'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters long.'],
      maxlength: [100, 'Company name cannot exceed 100 characters.'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required.'],
      trim: true,
      minlength: [10, 'Job description must be at least 10 characters long.'],
    },
    location: {
      type: String,
      required: [true, 'Location is required.'],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: {
        values: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
        message: '{VALUE} is not a valid employment type.',
      },
      default: 'full-time',
      index: true,
    },
    requiredSkills: {
      type: [String],
      required: [true, 'At least one required skill must be specified.'],
      validate: {
        validator: (skills: string[]) => Array.isArray(skills) && skills.length > 0,
        message: 'Job must specify at least one required skill.',
      },
      index: true,
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    salaryRange: {
      type: SalaryRangeSchema,
      required: false,
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'closed'],
        message: '{VALUE} is not a valid status.',
      },
      default: 'open',
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
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

// Indexes for searching and filtering
JobSchema.index({ title: 'text', company: 'text', description: 'text' });
JobSchema.index({ status: 1, createdAt: -1 });

export const Job: Model<IJobDocument> =
  mongoose.models.Job || mongoose.model<IJobDocument>('Job', JobSchema);

export default Job;
