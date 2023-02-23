import { z } from "zod";
import { basicIncludeForSong, embedStarAvgToSong } from "../lib/spotify";

import { protectedProcedure, createTRPCRouter } from "../trpc";

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
      const items = await ctx.prisma.feedSong.findMany({
        where: {
          hasInteracted: false,
          userId: ctx.session.user.id,
        },
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { specialId: cursor } : undefined,
        include: {
          song: {
            include: basicIncludeForSong(ctx.session.user.id),
          },
        },
        orderBy: {
          added: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.specialId;
      }

      return {
        items: items.map((song) =>
          embedStarAvgToSong<typeof song.song>(song.song),
        ),
        nextCursor,
      };
    }),
});
