import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAdminAuth } from '@/middleware/auth';

// GET all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = await withAdminAuth(request);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    await connectDB();
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
