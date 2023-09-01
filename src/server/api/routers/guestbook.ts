import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const guestbookRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          message: true,
          name: true,
        },
      })
    } catch (error) {
      console.log('error', error)
    }
  }),
  postMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.guestbook.create({
          data: {
            message: input.message,
            name: input.name,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }),
})
