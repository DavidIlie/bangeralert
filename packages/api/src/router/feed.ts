import { Song, Star } from "@acme/db";
import { protectedProcedure, createTRPCRouter } from "../trpc";

export const basicIncludeForSong = (userId: string) => ({
  album: {
    include: {
      artist: { select: { id: true, name: true } },
      interactions: {
        where: { userId: userId },
      },
    },
  },
  comments: { include: { commentOpinion: true } },
  stars: true,
  artist: true,
  _count: {
    select: {
      comments: true,
      stars: true,
    },
  },
});

export function getStarAvg<T>(song: T | (Song & { stars: Star[] })) {
  const starsArray = (song as any).stars.map((star: T) => (star as any).rating);
  const sum = starsArray.reduce((a: any, b: any) => a + b, 0);
  (song as any)._stars = sum / starsArray.length || 0;
  return song as T & { _stars: number };
}

export const feedRouter = createTRPCRouter({
  getFeed: protectedProcedure.query(async ({ ctx }) => {
    return (
      await ctx.prisma.song.findMany({
        include: basicIncludeForSong(ctx.session.user.id),
        orderBy: {
          created: "desc",
        },
      })
    ).map((song) => getStarAvg<typeof song>(song));
  }),
});
