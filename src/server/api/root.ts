import { guestbookRouter } from './routers/guestbook'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  guestbook: guestbookRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
