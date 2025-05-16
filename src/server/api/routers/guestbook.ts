import { z } from 'zod'

import { router, publicProcedure } from '@/server/api/trpc'

export const guestbookRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          name: true,
          message: true,
        },
      })
    } catch (error) {
      console.log('error', error)
    }
  }),
  postMessage: publicProcedure
    .input(
      z.object({
        name: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.guestbook.create({
          data: {
            name: input.name,
            message: input.message,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }),
})
