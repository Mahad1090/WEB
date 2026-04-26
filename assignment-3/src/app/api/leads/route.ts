import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import { withAuth, withAdminAuth } from '@/middleware/auth';
import { CreateLeadInput, LeadStatus } from '@/types';
import { z } from 'zod';

const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  propertyInterest: z.string().min(2, 'Property interest is required'),
  budget: z.number().positive('Budget must be positive'),
  notes: z.string().optional(),
});

// GET all leads (Admin sees all, Agent sees only assigned)
export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    const { user } = auth;
    await connectDB();
    
    // Build query based on user role
    const query: any = {};
    if (user.role === 'agent') {
      query.assignedTo = user._id;
    }
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    if (status && Object.values(LeadStatus).includes(status as LeadStatus)) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ leads }, { status: 200 });
  } catch (error: any) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new lead
export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    const body = await request.json();
    const validatedData = createLeadSchema.parse(body);
    
    await connectDB();
    
    // Create lead with automatic scoring via middleware
    const lead = await Lead.create({
      ...validatedData,
      createdBy: auth.user._id,
      notes: validatedData.notes || '',
    });
    
    // Log activity
    await ActivityLog.create({
      leadId: lead._id,
      userId: auth.user._id,
      userName: auth.user.name,
      action: 'lead_created',
      details: `Lead created for ${lead.name}`,
      newData: validatedData,
    });
    
    // Populate lead with user info
    const populatedLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    return NextResponse.json(
      { message: 'Lead created successfully', lead: populatedLead },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    
    console.error('Create lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
