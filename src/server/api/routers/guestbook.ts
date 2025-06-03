import { z } from 'zod'

import { router, publicProcedure, protectedProcedure } from '@/server/api/trpc'

export const guestbookRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })
    } catch (error) {
      console.log('error', error)
      throw new Error('Failed to fetch guestbook entries')
    }
  }),
  postMessage: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.guestbook.create({
          data: {
            name: ctx.session.user.name ?? 'Anonymous',
            message: input.message,
          },
        })
      } catch (error) {
        console.log(error)
        throw new Error('Failed to post message')
      }
    }),
})
