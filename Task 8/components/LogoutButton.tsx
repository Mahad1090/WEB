'use client'

import { useState } from 'react'
import { logOut } from '@/lib/auth/actions'
import { Button, LoadingSpinner } from '@/components/UI'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await logOut()
      // logOut redirects automatically
    } catch (error) {
      console.error('Logout error:', error)
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 px-8"
    >
      {loading ? <LoadingSpinner message="" /> : 'Logout'}
    </Button>
  )
}
