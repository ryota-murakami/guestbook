'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { httpBatchLink } from '@trpc/client'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import superjson from 'superjson'

import { trpc } from '@/utils/trpc'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient as any}>
        <SessionProvider>{children}</SessionProvider>
        <ReactQueryDevtools />
      </trpc.Provider>
    </QueryClientProvider>
  )
}
