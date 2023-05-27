import { createTRPCRouter } from "./trpc";
import { guestbookRouter } from "./routers/guestbook";

export const appRouter = createTRPCRouter({
  guestbook: guestbookRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
