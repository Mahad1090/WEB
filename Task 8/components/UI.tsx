'use client'

import { ReactNode } from 'react'

interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      <span className="text-lg text-gray-600">{message}</span>
    </div>
  )
}

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

interface InputProps {
  type?: string
  placeholder?: string
  name: string
  required?: boolean
  className?: string
}

export function Input({
  type = 'text',
  placeholder = '',
  name,
  required = false,
  className = '',
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      required={required}
      className={`w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-blue-500 focus:outline-none ${className}`}
    />
  )
}
