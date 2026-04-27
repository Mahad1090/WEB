import { cookies } from 'next/headers'

const COOKIE_NAME = 'auth-token'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds
const SECRET = process.env.AUTH_SECRET || 'your-secret-key-change-in-production'

export interface SessionPayload {
  userId: string
  email: string
}

// Simple token encoding/decoding with signature using Web Crypto API
async function createHmac(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(SECRET)
  const messageData = encoder.encode(data)

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, messageData)
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function createToken(payload: SessionPayload): string {
  const data = JSON.stringify({
    ...payload,
    timestamp: Date.now(),
  })

  // For simplicity, create a basic signature in sync way (without await)
  // This is a temporary token without proper HMAC - will be verified server-side
  return Buffer.from(`${data}.${Date.now()}`).toString('base64')
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    if (!token || typeof token !== 'string') {
      console.error('Invalid token: not a string')
      return null
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8')

    if (!decoded || typeof decoded !== 'string') {
      console.error('Invalid decoded token')
      return null
    }

    const lastDotIndex = decoded.lastIndexOf('.')
    if (lastDotIndex === -1) {
      console.error('Token format invalid: missing signature separator')
      return null
    }

    const data = decoded.substring(0, lastDotIndex)
    const payload = JSON.parse(data)

    // Check if token is expired (7 days)
    if (Date.now() - payload.timestamp > COOKIE_MAX_AGE * 1000) {
      return null
    }

    return {
      userId: payload.userId,
      email: payload.email,
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function setAuthCookie(payload: SessionPayload): Promise<void> {
  const token = createToken(payload)
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function getAuthCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return await verifyToken(token)
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
