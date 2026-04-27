import { ReactNode } from 'react'
import { Header } from '@/components/Header'
import '@/styles/globals.css'

export const metadata = {
  title: 'Auth System - Next.js & MongoDB',
  description: 'Complete authentication system with Next.js and MongoDB',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Header />
        <main className="mx-auto max-w-4xl px-6 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-gray-200 bg-white py-8 text-center text-gray-600">
          <p>&copy; 2024 Auth System. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
