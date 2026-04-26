import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitStore>();

const AGENT_LIMIT = 50; // 50 requests per minute
const ADMIN_LIMIT = 1000; // Effectively no limit for admins
const WINDOW_MS = 60 * 1000; // 1 minute window

function getIdentifier(request: NextRequest): string {
  // Try to get user ID from token first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      // Simple token parsing to get userId (in production, use proper JWT verification)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      if (payload.userId) {
        return `user-${payload.userId}`;
      }
    } catch (e) {
      // If token parsing fails, fall back to IP
    }
  }
  
  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return `ip-${ip}`;
}

export async function withRateLimit(request: NextRequest, userRole?: string) {
  const identifier = getIdentifier(request);
  const now = Date.now();
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
    rateLimitStore.set(identifier, entry);
  }
  
  // Determine limit based on user role
  const limit = userRole === 'admin' ? ADMIN_LIMIT : AGENT_LIMIT;
  
  // Increment counter
  entry.count++;
  
  // Check if limit exceeded
  if (entry.count > limit) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: resetIn,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': Math.max(0, limit - entry.count).toString(),
          'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
          'Retry-After': resetIn.toString(),
        },
      }
    );
  }
  
  // Add rate limit headers to successful responses
  return {
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': Math.max(0, limit - entry.count).toString(),
      'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
    },
  };
}

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, WINDOW_MS);
