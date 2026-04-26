import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import Lead from '@/models/Lead';
import { withAuth } from '@/middleware/auth';

// GET activity timeline for a lead
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await withAuth(request);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    const { user } = auth;
    await connectDB();
    
    // Check if lead exists
    const lead = await Lead.findById(params.id);
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Check if agent has access to this lead
    if (user.role === 'agent' && lead.assignedTo?.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Forbidden - You can only view activities for your assigned leads' },
        { status: 403 }
      );
    }
    
    // Get activities for this lead
    const activities = await ActivityLog.find({ leadId: params.id })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ activities }, { status: 200 });
  } catch (error: any) {
    console.error('Get activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
