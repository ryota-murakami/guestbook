// This is a placeholder file for the tRPC route handler
// The actual implementation will be done in a later task (Task ID 8)

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { NextRequest } from 'next/server'

import { appRouter } from '@/server/api/root'
import { createTRPCContext } from '@/server/api/trpc'

// App Routeru3067u306ftRPCu30eau30afu30a8u30b9u30c8u3092u51e6u7406u3059u308bu30cfu30f3u30c9u30e9u30fcu3092u5b9fu88c5
// u6ce8u610f: u3053u308cu306fu6682u5b9au7684u306au5b9fu88c5u3067u3042u308au3001u30bfu30b9u30af8u3067u5b8cu5168u306au5b9fu88c5u3092u884cu3044u307eu3059

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
  })

export { handler as GET, handler as POST }
