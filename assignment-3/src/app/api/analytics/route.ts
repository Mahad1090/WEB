import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import User from '@/models/User';
import { withAdminAuth } from '@/middleware/auth';
import { LeadStatus, LeadPriority } from '@/types';

// GET analytics data (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = await withAdminAuth(request);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    await connectDB();
    
    // Get total leads
    const totalLeads = await Lead.countDocuments();
    
    // Get leads by status
    const leadsByStatus = {
      [LeadStatus.NEW]: await Lead.countDocuments({ status: LeadStatus.NEW }),
      [LeadStatus.CONTACTED]: await Lead.countDocuments({ status: LeadStatus.CONTACTED }),
      [LeadStatus.IN_PROGRESS]: await Lead.countDocuments({ status: LeadStatus.IN_PROGRESS }),
      [LeadStatus.CLOSED]: await Lead.countDocuments({ status: LeadStatus.CLOSED }),
      [LeadStatus.LOST]: await Lead.countDocuments({ status: LeadStatus.LOST }),
    };
    
    // Get leads by priority
    const leadsByPriority = {
      [LeadPriority.HIGH]: await Lead.countDocuments({ priority: LeadPriority.HIGH }),
      [LeadPriority.MEDIUM]: await Lead.countDocuments({ priority: LeadPriority.MEDIUM }),
      [LeadPriority.LOW]: await Lead.countDocuments({ priority: LeadPriority.LOW }),
    };
    
    // Get all agents
    const agents = await User.find({ role: 'agent' });
    
    // Get agent performance
    const agentPerformance = await Promise.all(
      agents.map(async (agent) => {
        const agentLeads = await Lead.find({ assignedTo: agent._id });
        const totalLeads = agentLeads.length;
        const closedLeads = agentLeads.filter((l) => l.status === LeadStatus.CLOSED).length;
        const inProgressLeads = agentLeads.filter((l) => l.status === LeadStatus.IN_PROGRESS).length;
        
        // Calculate overdue follow-ups
        const overdueFollowups = agentLeads.filter((l) => {
          if (!l.followUpDate) return false;
          return new Date(l.followUpDate) < new Date();
        }).length;
        
        return {
          agentId: agent._id.toString(),
          agentName: agent.name,
          totalLeads,
          closedLeads,
          inProgressLeads,
          overdueFollowups,
        };
      })
    );
    
    // Get recent leads (last 10)
    const recentLeads = await Lead.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    
    return NextResponse.json(
      {
        totalLeads,
        leadsByStatus,
        leadsByPriority,
        agentPerformance,
        recentLeads,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
