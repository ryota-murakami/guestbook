import { z } from 'zod'

import { router, publicProcedure, protectedProcedure } from '@/server/api/trpc'

export const exampleRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.example.findMany()
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!'
  }),

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      }
    }),
})
