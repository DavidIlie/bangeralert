import { protectedProcedure, createTRPCRouter } from "../trpc";

export const feedRouter = createTRPCRouter({
  getFeed: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.song.findMany({
      include: {
        album: {
          include: {
            artist: { select: { id: true, name: true } },
            comments: { include: { commentOpinion: true } },
            stars: true,
            interactions: {
              where: { userId: ctx.session.user.id },
            },
          },
        },
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
    });
  }),
});
