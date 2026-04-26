import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import ActivityLog from '@/models/ActivityLog';
import { withAuth } from '@/middleware/auth';
import { ActivityType } from '@/types';
import { z } from 'zod';

const updateLeadSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  propertyInterest: z.string().min(2).optional(),
  budget: z.number().positive().optional(),
  status: z.enum(['new', 'contacted', 'in_progress', 'closed', 'lost']).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
  followUpDate: z.string().optional().nullable(),
});

// GET single lead
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
    
    const lead = await Lead.findById(params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Check if agent has access to this lead
    if (user.role === 'agent' && lead.assignedTo?.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Forbidden - You can only view your assigned leads' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ lead }, { status: 200 });
  } catch (error: any) {
    console.error('Get lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update lead
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await withAuth(request);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    const { user } = auth;
    const body = await request.json();
    const validatedData = updateLeadSchema.parse(body);
    
    await connectDB();
    
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
        { error: 'Forbidden - You can only update your assigned leads' },
        { status: 403 }
      );
    }
    
    // Store previous data for activity log
    const previousData = { ...lead.toObject() };
    
    // Update lead
    Object.assign(lead, validatedData);
    
    // Handle followUpDate conversion
    if (validatedData.followUpDate !== undefined) {
      lead.followUpDate = validatedData.followUpDate ? new Date(validatedData.followUpDate) : null;
    }
    
    await lead.save();
    
    // Log activity based on what changed
    if (validatedData.status && validatedData.status !== previousData.status) {
      await ActivityLog.create({
        leadId: lead._id,
        userId: user._id,
        userName: user.name,
        action: ActivityType.STATUS_CHANGED,
        details: `Status changed from ${previousData.status} to ${validatedData.status}`,
        previousData: { status: previousData.status },
        newData: { status: validatedData.status },
      });
    }
    
    if (validatedData.assignedTo && validatedData.assignedTo !== previousData.assignedTo?.toString()) {
      const action = previousData.assignedTo ? ActivityType.REASSIGNED : ActivityType.ASSIGNED;
      await ActivityLog.create({
        leadId: lead._id,
        userId: user._id,
        userName: user.name,
        action,
        details: `Lead ${action === ActivityType.ASSIGNED ? 'assigned' : 'reassigned'}`,
        previousData: { assignedTo: previousData.assignedTo },
        newData: { assignedTo: validatedData.assignedTo },
      });
    }
    
    if (validatedData.notes && validatedData.notes !== previousData.notes) {
      await ActivityLog.create({
        leadId: lead._id,
        userId: user._id,
        userName: user.name,
        action: ActivityType.NOTE_ADDED,
        details: 'Note updated',
        previousData: { notes: previousData.notes },
        newData: { notes: validatedData.notes },
      });
    }
    
    if (validatedData.followUpDate !== undefined) {
      await ActivityLog.create({
        leadId: lead._id,
        userId: user._id,
        userName: user.name,
        action: ActivityType.FOLLOWUP_SET,
        details: `Follow-up date ${validatedData.followUpDate ? 'set to ' + validatedData.followUpDate : 'cleared'}`,
        previousData: { followUpDate: previousData.followUpDate },
        newData: { followUpDate: validatedData.followUpDate },
      });
    }
    
    // Populate lead with user info
    const populatedLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    return NextResponse.json(
      { message: 'Lead updated successfully', lead: populatedLead },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    
    console.error('Update lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE lead
export async function DELETE(
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
    
    const lead = await Lead.findById(params.id);
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Only admins can delete leads
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can delete leads' },
        { status: 403 }
      );
    }
    
    // Log activity before deletion
    await ActivityLog.create({
      leadId: lead._id,
      userId: user._id,
      userName: user.name,
      action: ActivityType.LEAD_DELETED,
      details: `Lead ${lead.name} deleted`,
      previousData: lead.toObject(),
    });
    
    await Lead.findByIdAndDelete(params.id);
    
    return NextResponse.json(
      { message: 'Lead deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
