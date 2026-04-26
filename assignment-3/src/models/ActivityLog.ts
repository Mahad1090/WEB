import mongoose, { Schema, Document, Model } from 'mongoose';
import { ActivityType } from '@/types';

export interface IActivityLog extends Document {
  leadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  action: ActivityType;
  details: string;
  previousData?: Record<string, any>;
  newData?: Record<string, any>;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    previousData: {
      type: Schema.Types.Mixed,
      default: null,
    },
    newData: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ActivityLogSchema.index({ leadId: 1, createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });

const ActivityLog: Model<IActivityLog> = 
  mongoose.models.ActivityLog || 
  mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
