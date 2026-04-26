import mongoose, { Schema, Document, Model } from 'mongoose';
import { LeadStatus, LeadPriority } from '@/types';

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  propertyInterest: string;
  budget: number;
  status: LeadStatus;
  priority: LeadPriority;
  score: number;
  notes: string;
  assignedTo: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId;
  followUpDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    propertyInterest: {
      type: String,
      required: [true, 'Property interest is required'],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be positive'],
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    priority: {
      type: String,
      enum: Object.values(LeadPriority),
      default: LeadPriority.LOW,
    },
    score: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate lead score based on budget
LeadSchema.pre('save', function () {
  if (this.isModified('budget')) {
    const budget = this.budget;
    
    // Scoring logic based on budget
    if (budget > 20000000) {
      this.priority = LeadPriority.HIGH;
      this.score = 100;
    } else if (budget >= 10000000) {
      this.priority = LeadPriority.MEDIUM;
      this.score = 50;
    } else {
      this.priority = LeadPriority.LOW;
      this.score = 25;
    }
  }
});

// Index for faster queries
LeadSchema.index({ status: 1 });
LeadSchema.index({ priority: 1 });
LeadSchema.index({ assignedTo: 1 });
LeadSchema.index({ createdAt: -1 });

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
