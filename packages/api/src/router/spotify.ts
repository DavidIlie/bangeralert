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
    let response;

    try {
      response = await (
        await makeRequest(`me/player`, ctx.spotifyToken)
      ).json();
    } catch (error) {
      throw new TRPCError({
        message: "You are not playing any song!!",
        code: "BAD_REQUEST",
      });
    }

    const song = parseSong(response.item);
    await addSongById(song.spotify_id, ctx.spotifyToken);

    return true;
  }),
  pauseClientIfPlaying: spotifyProcedure
    .input(z.object({ deviceId: z.string(), songId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await (
          await makeRequest(`me/player`, ctx.spotifyToken)
        ).json();

        if (response.device.id !== input.deviceId) return false;
        if (response.item === null) return false;
        if (!response.is_playing) return false;

        if (response.item.id === input.songId) return "DONT_PAUSE";
        if (!response.is_playing) return "DONT_PAUSE";

        await makeRequest(`me/player/pause`, ctx.spotifyToken, "PUT");
      } catch (error) {
        return false;
      }

      return true;
    }),
  resumePlayback: spotifyProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await (
          await makeRequest(`me/player`, ctx.spotifyToken)
        ).json();

        if (response.device.id !== input.deviceId) return true;
        if (response.item === null) return true;
        if (response.is_playing) return true;
        await makeRequest(`me/player/play`, ctx.spotifyToken, "PUT");
      } catch (error) {
        return true;
      }

      return true;
    }),
  currentListening: spotifyProcedure.query(async ({ ctx }) => {
    return await (await makeRequest(`me/player`, ctx.spotifyToken)).json();
  }),
});
