import { protectedProcedure, createTRPCRouter } from "../trpc";

export const feedRouter = createTRPCRouter({
  getFeed: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.song.findMany({
      include: {
        album: {
          include: { artist: { select: { id: true, name: true } } },
        },
        _count: {
          select: {
            Comments: true,
            Stars: true,
          },
        },
      },
      orderBy: {
        created: "asc",
      },
    });
  }),
});
