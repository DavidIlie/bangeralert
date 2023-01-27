import { protectedProcedure, createTRPCRouter } from "../trpc";

export const feedRouter = createTRPCRouter({
  getFeed: protectedProcedure.query(async ({ ctx }) => {
    return (
      await ctx.prisma.song.findMany({
        include: {
          album: {
            include: {
              artist: { select: { id: true, name: true } },
              interactions: {
                where: { userId: ctx.session.user.id },
              },
            },
          },
          comments: { include: { commentOpinion: true } },
          stars: true,
          _count: {
            select: {
              comments: true,
              stars: true,
            },
          },
        },
        orderBy: {
          created: "desc",
        },
      })
    ).map((song) => {
      const starsArray = song.stars.map((star) => star.rating);
      const sum = starsArray.reduce((a, b) => a + b, 0);
      (song as any)._stars = sum / starsArray.length || 0;
      return song as typeof song & { _stars: number };
    });
  }),
});
