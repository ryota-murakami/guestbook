import { router } from '@/server/api/trpc'

import { guestbookRouter } from './routers/guestbook'

export const appRouter = router({
  guestbook: guestbookRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
