'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import { setAuthCookie, clearAuthCookie, getAuthCookie } from './cookies'

export async function signUp(formData: FormData) {
  try {
    await connectDB()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validation
    if (!email || !password || !confirmPassword) {
      return { error: 'All fields are required' }
    }

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' }
    }

    if (password.length < 8) {
      return { error: 'Password must be at least 8 characters long' }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return { error: 'Email already registered' }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    // Set auth cookie
    await setAuthCookie({
      userId: newUser._id.toString(),
      email: newUser.email,
    })

    redirect('/dashboard')
  } catch (error: any) {
    // Re-throw redirect errors so they work properly
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Signup error:', errorMessage, error)
    return { error: `Failed to create account: ${errorMessage}` }
  }
}

export async function logIn(formData: FormData) {
  try {
    await connectDB()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validation
    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    )
    if (!user) {
      return { error: 'Invalid email or password' }
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return { error: 'Invalid email or password' }
    }

    // Set auth cookie
    await setAuthCookie({
      userId: user._id.toString(),
      email: user.email,
    })

    redirect('/dashboard')
  } catch (error: any) {
    // Re-throw redirect errors so they work properly
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Login error:', error)
    return { error: 'Failed to login' }
  }
}

export async function logOut() {
  try {
    await clearAuthCookie()
    redirect('/login')
  } catch (error: any) {
    // Re-throw redirect errors so they work properly
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Logout error:', error)
    return { error: 'Failed to logout' }
  }
}

export async function getCurrentUser() {
  try {
    const session = await getAuthCookie()
    if (!session) {
      return null
    }

    await connectDB()
    const user = await User.findById(session.userId)
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}
