import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { spotifyProcedure, createTRPCRouter } from "../trpc";

import { addSongById } from "../lib/addSongById";
import { makeRequest, parseSong } from "../lib/spotify";
import { basicIncludeForSong, getStarAvg } from "./feed";

export const spotifyRouter = createTRPCRouter({
  create: spotifyProcedure
    .input(z.object({ songId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = await addSongById(input.songId, ctx.spotifyToken);
      return id;
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
  currentListeningBoolean: spotifyProcedure.query(async ({ ctx }) => {
    try {
      const response = await (
        await makeRequest(`me/player`, ctx.spotifyToken)
      ).json();
      return {
        is_playing: response.is_playing,
      };
    } catch (error) {
      return false;
    }
  }),
  currentlyListening: spotifyProcedure.mutation(async ({ ctx }) => {
    try {
      const response = await (
        await makeRequest(`me/player`, ctx.spotifyToken)
      ).json();

      const song = parseSong((response as any).item);

      const prismaSong = await ctx.prisma.song.findFirst({
        where: { spotify_id: song.spotify_id },
        include: basicIncludeForSong(ctx.session.user.id),
      });

      if (prismaSong) {
        return getStarAvg<typeof prismaSong>(prismaSong);
      }

      return parseSong((response as any).item);
    } catch (error) {
      return false;
    }
  }),
  currentlyListeningBasic: spotifyProcedure.query(async ({ ctx }) => {
    try {
      const response = await (
        await makeRequest(`me/player`, ctx.spotifyToken)
      ).json();
      if (!response.is_playing) return false;
      return parseSong(response.item);
    } catch (error) {
      return false;
    }
  }),
  getSong: spotifyProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let songId;
      try {
        songId = input.url
          .split("https://open.spotify.com/track/")[1]
          ?.split("?si=")[0];
      } catch (error) {
        throw new TRPCError({
          message: "wrong URL format!",
          code: "BAD_REQUEST",
        });
      }

      const prismaSong = await ctx.prisma.song.findFirst({
        where: { spotify_id: songId },
        include: basicIncludeForSong(ctx.session.user.id),
      });

      if (prismaSong) {
        return getStarAvg<typeof prismaSong>(prismaSong);
      }

      return parseSong(
        await (await makeRequest(`tracks/${songId}`, ctx.spotifyToken)).json(),
      );
    }),
});
