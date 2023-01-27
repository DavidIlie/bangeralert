import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";

export const songRouter = createTRPCRouter({
  addRating: protectedProcedure
    .input(z.object({ songId: z.string().uuid(), rating: z.number().max(5) }))
    .mutation(async ({ ctx, input }) => {
      const song = await ctx.prisma.song.findFirst({
        where: { id: input.songId },
      });

      if (!song)
        throw new TRPCError({
          message: "could not find song!!",
          code: "NOT_FOUND",
        });

      const star = await ctx.prisma.star.findFirst({
        where: { userId: ctx.session.user.id, songId: song.spotify_id },
      });

      if (!star) {
        return await ctx.prisma.star.create({
          data: {
            songId: song.spotify_id,
            rating: input.rating,
            userId: ctx.session.user.id,
          },
        });
      }

      if (input.rating === 0)
        return await ctx.prisma.star.delete({ where: { id: star.id } });

      return await ctx.prisma.star.update({
        where: { id: star.id },
        data: { rating: input.rating },
      });
    }),
});
