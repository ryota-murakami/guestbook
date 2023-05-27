import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const guestbookRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      //eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      return await ctx.prisma.guestbook.findMany({
        select: {
          name: true,
          message: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.log('error', error)
    }
  }),
  postMessage: publicProcedure
    .input(
      z.object({
        name: z.string(),
        messsage: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
        try {
          //eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
          await ctx.prisma.guestbook.create({
            data: {
              name: input.name,
              message: input.messsage
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    )
})