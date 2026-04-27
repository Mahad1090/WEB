import { redirect } from 'next/navigation'
import { getAuthCookie } from '@/lib/auth/cookies'

export default async function Home() {
  const session = await getAuthCookie()

  if (session) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
