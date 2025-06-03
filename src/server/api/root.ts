import { guestbookRouter } from './routers/guestbook'
import { router } from '@/server/api/trpc'

export const appRouter = router({
  guestbook: guestbookRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
