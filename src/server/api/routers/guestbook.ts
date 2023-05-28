import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const guestbookRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      //eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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
      //eslint-disable-next-line no-console
      console.log('error', error)
    }
  }),
  postMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        name: z.string(),
      })
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
        //eslint-disable-next-line no-console
        console.log(error)
      }
    }),
})
