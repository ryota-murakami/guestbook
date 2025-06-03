import type { Metadata } from 'next'

import { SignInButton } from '@/components/auth/SignInButton'
import { SignOutButton } from '@/components/auth/SignOutButton'
import { GuestbookEntries } from '@/components/guestbook/GuestbookEntries'
import { GuestbookForm } from '@/components/guestbook/GuestbookForm'
import { getServerAuthSession } from '@/server/auth'
import { prisma } from '@/server/db'

export async function generateMetadata(): Promise<Metadata> {
  const entryCount = await prisma.guestbook.count()

  return {
    title: 'Guestbook App',
    description: `Join our guestbook community with ${entryCount} entries and leave your own message!`,
    openGraph: {
      title: 'Guestbook App - Home',
      description: `Join our guestbook community with ${entryCount} entries and leave your own message!`,
    },
    twitter: {
      title: 'Guestbook App - Home',
      description: `Join our guestbook community with ${entryCount} entries and leave your own message!`,
    },
  }
}

export default async function HomePage() {
  const session = await getServerAuthSession()
  const entries = await prisma.guestbook.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Guestbook
        </h1>
        <div className="flex flex-col items-center gap-2">
          {session ? (
            <>
              <p className="text-center text-2xl">
                <span>Logged in as {session.user?.name}</span>
              </p>
              <SignOutButton />
              <GuestbookForm />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
        <GuestbookEntries initialEntries={entries} />
      </div>
    </main>
  )
}
