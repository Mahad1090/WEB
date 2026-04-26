export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent'
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
  LOST = 'lost'
}

export enum LeadPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum ActivityType {
  LEAD_CREATED = 'lead_created',
  LEAD_UPDATED = 'lead_updated',
  LEAD_DELETED = 'lead_deleted',
  STATUS_CHANGED = 'status_changed',
  ASSIGNED = 'assigned',
  REASSIGNED = 'reassigned',
  NOTE_ADDED = 'note_added',
  FOLLOWUP_SET = 'followup_set'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  propertyInterest: string;
  budget: number;
  status: LeadStatus;
  priority: LeadPriority;
  score: number;
  notes: string;
  assignedTo: string | null;
  assignedToName?: string;
  createdBy: string;
  followUpDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  _id: string;
  leadId: string;
  userId: string;
  userName: string;
  action: ActivityType;
  details: string;
  previousData?: Record<string, any>;
  newData?: Record<string, any>;
  createdAt: Date;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  propertyInterest: string;
  budget: number;
  notes?: string;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  propertyInterest?: string;
  budget?: number;
  status?: LeadStatus;
  notes?: string;
  assignedTo?: string;
  followUpDate?: Date | null;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AnalyticsData {
  totalLeads: number;
  leadsByStatus: Record<LeadStatus, number>;
  leadsByPriority: Record<LeadPriority, number>;
  agentPerformance: Array<{
    agentId: string;
    agentName: string;
    totalLeads: number;
    closedLeads: number;
    inProgressLeads: number;
    overdueFollowups: number;
  }>;
  recentLeads: Lead[];
}
