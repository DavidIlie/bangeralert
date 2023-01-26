import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { spotifyProcedure, createTRPCRouter } from "../trpc";

import { addSongById } from "../lib/addSongById";
import { makeRequest, parseSong } from "../lib/spotify";

export const spotifyRouter = createTRPCRouter({
  create: spotifyProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const songId = input.url
        .split("https://open.spotify.com/track/")[1]
        ?.split("?si=")[0];

      await addSongById(songId, ctx.spotifyToken);

      return true;
    }),
  createCurrentlyListening: spotifyProcedure.mutation(async ({ ctx }) => {
    const response = await (
      await makeRequest(`me/player`, ctx.spotifyToken)
    ).json();

    let song;
    try {
      song = parseSong(response.item);
    } catch (error) {
      throw new TRPCError({
        message: "You are not playing any song!!",
        code: "BAD_REQUEST",
      });
    }

    if (!song)
      throw new TRPCError({
        message: "You are not playing any song!!",
        code: "BAD_REQUEST",
      });

    await addSongById(song.spotify_id, ctx.spotifyToken);

    return true;
  }),
});
