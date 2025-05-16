import type { Metadata } from 'next'

import { Providers } from './providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Guestbook App',
  description: 'A simple guestbook application built with the T3 Stack',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
