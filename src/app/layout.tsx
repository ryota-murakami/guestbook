import type { Metadata } from 'next'

import { Providers } from './providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Guestbook App',
    template: '%s | Guestbook App',
  },
  description:
    'A simple guestbook application built with the T3 Stack and Next.js App Router',
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Server Components',
    'tRPC',
    'T3 Stack',
    'Guestbook',
  ],
  authors: [{ name: 'T3 Stack Developer' }],
  creator: 'T3 Stack Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://guestbook-app.vercel.app',
    title: 'Guestbook App',
    description:
      'A simple guestbook application built with the T3 Stack and Next.js App Router',
    siteName: 'Guestbook App',
    images: [
      {
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Guestbook App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guestbook App',
    description:
      'A simple guestbook application built with the T3 Stack and Next.js App Router',
    images: ['/images/og-image.svg'],
  },
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
