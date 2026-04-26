import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function withAuth(request: NextRequest) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }
  
  await connectDB();
  
  const user = await User.findById(decoded.userId);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - User not found' },
      { status: 401 }
    );
  }
  
  return { user, decoded };
}

export async function withAdminAuth(request: NextRequest) {
  const auth = await withAuth(request);
  
  if (auth instanceof NextResponse) {
    return auth;
  }
  
  if (auth.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }
  
  return auth;
}
