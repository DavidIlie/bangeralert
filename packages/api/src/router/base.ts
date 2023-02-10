import { publicProcedure, createTRPCRouter } from "../trpc";

export const baseRouter = createTRPCRouter({
  getDBSize: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.song.count();
  }),
});
