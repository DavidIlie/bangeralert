import { z } from "zod";

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
  getFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 15;
      const { cursor, skip } = input;
      const items = (
        await ctx.prisma.feedSong.findMany({
          where: {
            hasInteracted: false,
            userId: ctx.session.user.id,
          },
          take: limit + 1,
          skip: skip,
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            song: {
              include: basicIncludeForSong(ctx.session.user.id),
            },
          },
          orderBy: {
            added: "desc",
          },
        })
      ).map((song) => getStarAvg<typeof song.song>(song.song));

      let nextCursor: typeof cursor | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
});
