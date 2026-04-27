import { redirect } from 'next/navigation'
import { getAuthCookie } from '@/lib/auth/cookies'
import { getCurrentUser } from '@/lib/auth/actions'
import { LogoutButton } from '@/components/LogoutButton'

export const metadata = {
  title: 'Dashboard - Auth System',
}

export default async function DashboardPage() {
  // Check if user is authenticated
  const session = await getAuthCookie()

  if (!session) {
    redirect('/login')
  }

  // Get user details
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome! 👋</h1>
        <p className="text-lg opacity-90">You have successfully logged in to your account.</p>
      </div>

      {/* User Information Card */}
      <div className="rounded-lg bg-white p-8 shadow-md border-2 border-gray-200">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 border border-gray-200">
            <span className="text-gray-600 font-medium">Email Address:</span>
            <span className="font-semibold text-gray-900">{user.email}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 border border-gray-200">
            <span className="text-gray-600 font-medium">Account Status:</span>
            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-green-700 font-semibold">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 border border-gray-200">
            <span className="text-gray-600 font-medium">Member Since:</span>
            <span className="font-semibold text-gray-900">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Today'}
            </span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-blue-600">
          <h3 className="mb-2 text-lg font-bold text-gray-900">🔐 Secure</h3>
          <p className="text-gray-600">Your password is encrypted with bcrypt for maximum security.</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-green-600">
          <h3 className="mb-2 text-lg font-bold text-gray-900">⚡ Fast</h3>
          <p className="text-gray-600">MongoDB ensures quick data retrieval and smooth operations.</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-purple-600">
          <h3 className="mb-2 text-lg font-bold text-gray-900">🌐 Modern</h3>
          <p className="text-gray-600">Built with Next.js 15 and the latest web technologies.</p>
        </div>
      </div>

      {/* Logout Section */}
      <div className="flex justify-center pt-8">
        <LogoutButton />
      </div>
    </div>
  )
}
