import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { spotifyProcedure, createTRPCRouter } from "../trpc";

import { Configuration, OpenAIApi } from "openai";

import { addSongById, addSongByObject } from "../lib/addSong";
import { makeRequest, parseSong, SongResponseType } from "../lib/spotify";
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
  test: spotifyProcedure.query(async ({ ctx }) => {
    return await (
      await makeRequest(
        `me/tracks/contains?ids=7wtU7N6R49UAbzQcLjRy5q`,
        ctx.spotifyToken,
      )
    ).json();
  }),
  createPlaylist: spotifyProcedure
    // .input(z.object({ playlistId: z.string() }))
    .query(async ({ ctx }) => {
      const id = "1JDF5vx0Plf0FdN9QuS1tJ";

      let playlist;
      try {
        playlist = await (
          await makeRequest(`playlists/${id}`, ctx.spotifyToken)
        ).json();
      } catch (error) {}

      const owner = playlist.owner.id;

      const checkOwnerOnPlatform = await ctx.prisma.user.findFirst({
        where: {
          spotifyId: owner,
        },
      });

      let extraWhere;
      if (checkOwnerOnPlatform)
        extraWhere = { userId: checkOwnerOnPlatform.id };

      const prismaPlaylist = await ctx.prisma.playlist.upsert({
        where: { spotify_id: id },
        create: {
          spotify_id: playlist.id,
          description: playlist.description,
          photo: playlist.images[0].url,
          followers: playlist.followers.total,
          spotify_url: playlist.external_urls.spotify,
          collaborative: playlist.collaborative,
          ...extraWhere,
        },
        update: {
          spotify_id: playlist.id,
          description: playlist.description,
          photo: playlist.images[0].url,
          followers: playlist.followers.total,
          spotify_url: playlist.external_urls.spotify,
          collaborative: playlist.collaborative,
          ...extraWhere,
        },
      });

      const promises = [];
      for (let i = 0; i < playlist.tracks.total; i += 100) {
        promises.push(
          makeRequest(`playlists/${id}/tracks`, ctx.spotifyToken, "GET", {
            offset: i,
            limit: 100,
          }),
        );
      }

      const responses = await Promise.all(promises);
      const data = (await Promise.all(responses.map((res) => res.json())))[0];

      const allSongs = data.items.map((song: any) =>
        parseSong(song.track),
      ) as SongResponseType[];

      let songsToBeAdded = [] as SongResponseType[];

      await Promise.all(
        allSongs.map(async (s) => {
          const check = await ctx.prisma.song.findFirst({
            where: { spotify_id: s.spotify_id },
          });
          if (!check) return songsToBeAdded.push(s);
        }),
      );

      let songNumber = 0;

      for (const song of songsToBeAdded) {
        const data = await addSongByObject(song, ctx.spotifyToken);
        songNumber++;
        console.log(
          `ADDED SONG: ${data.name} by ${data.artist[0]?.name} (${songNumber}). ID: ${song.spotify_id}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 333));
      }

      await ctx.prisma.playlistSongLink.upsert({
        where: {
          songSpotId: id,
        },
        update: {
          songId: id,
          playlistId: prismaPlaylist.id,
        },
        create: {
          songSpotId: id,
          songId: id,
          playlistId: prismaPlaylist.id,
        },
      });

      return allSongs;
    }),
  bulkImport: spotifyProcedure.query(async ({ ctx }) => {
    if (process.env.NODE_ENV !== "development")
      throw new TRPCError({ message: "no can do", code: "BAD_REQUEST" });

    const userId = (await (await makeRequest(`me`, ctx.spotifyToken)).json())
      .id;

    const userPlaylists = await (
      await makeRequest(`me/playlists`, ctx.spotifyToken)
    ).json();

    let playlistIds = userPlaylists.items
      .filter((s: any) => s.owner.id !== userId)
      .map((playlist: any) => ({
        id: playlist.id as string,
        total: playlist.tracks.total as number,
      }));

    let bigData = [] as any[];

    await Promise.all(
      playlistIds.map(async (playlistData: { id: string; total: number }) => {
        const promises = [];
        for (let i = 0; i < playlistData.total; i += 100) {
          promises.push(
            makeRequest(
              `playlists/${playlistData.id}/tracks`,
              ctx.spotifyToken,
              "GET",
              { offset: i, limit: 100 },
            ),
          );
        }

        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map((res) => res.json()));
        bigData.push(data);
      }),
    );

    let songNumber = 0;

    for (const playlist of bigData) {
      for (const s of playlist) {
        for (const playlistItem of s.items) {
          try {
            const song = playlistItem.track;
            const data = await addSongById(song.id, ctx.spotifyToken);
            songNumber++;
            console.log(
              `ADDED SONG: ${data.name} by ${data.artist[0]?.name} (${songNumber}). ID: ${song.id}`,
            );
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (error) {
            console.log(`ERROR: ${error}`);
          }
        }
        console.log("DONE PLAYLIST");
      }
    }

    return true;
  }),
  genres: spotifyProcedure.query(async ({ ctx }) => {
    let topArtists = (
      await (await makeRequest("me/top/artists", ctx.spotifyToken)).json()
    ).items as { name: string; genres: string[] }[];
    topArtists = topArtists.map((artist) => ({
      name: artist.name,
      genres: artist.genres,
    }));

    let artistsString = "";
    topArtists.forEach(function (artist) {
      artistsString += `${artist.name} with genres ${artist.genres.join(
        ", ",
      )}. `;
    });

    let take = 50;

    let unlistenedSongs = [] as SongForOpenAI[];

    while (unlistenedSongs.length !== 15) {
      const ids = (
        await ctx.prisma.$queryRaw<
          {
            id: string;
          }[]
        >`SELECT id FROM public."Song" ORDER BY random() LIMIT ${take}`
      ).map((r) => r.id);

      const randomSongs = (
        await ctx.prisma.song.findMany({
          where: { id: { in: ids } },
          take: take,
          include: {
            artist: true,
          },
        })
      ).map((song) => ({
        name: song.name,
        id: song.spotify_id,
        artist: song.artist.map((artist) => ({
          name: artist.name,
          genres: artist.genres,
        })),
      }));

      await Promise.all(
        randomSongs.map(async (song) => {
          const isSaved = await (
            await makeRequest(
              `me/tracks/contains?ids=${song.id}`,
              ctx.spotifyToken,
            )
          ).json();

          if (!isSaved) unlistenedSongs.push(song);
        }),
      );
    }

    function formatSongs(
      songs: {
        name: string;
        id: string;
        artist: { name: string; genres: string[] }[];
      }[],
    ): string {
      const songLines = songs.map((song) => {
        const artists = song.artist.map((artist) => artist.name).join(", ");
        const genres = [
          ...new Set(song.artist.flatMap((artist) => artist.genres)),
        ].join(", ");
        return `${song.name} with its identifier code is '${song.id}' by ${artists} with the genres ${genres}`;
      });
      return songLines.join(". ");
    }

    let randomSongsString = formatSongs(unlistenedSongs);

    const infoOne = `My top artists and their respective genres are: ${artistsString}. Please don't respond, just keep it in mind.`;
    const infoTwo = `Here are some random songs: ${randomSongsString}. Please don't respond at all, just keep it in mind for my next prompt.`;
    const paragraphInfo = `With that information, the first paragraph shows my top artists and their respective genre's. Keep that in mind. Now the next paragraph contains 50 random songs with their own respective genre, keep that in mind their genre and its identifier code`;
    const attemptPrompt = `I would like you to pick me 15 songs from the second paragraph, which could be similar to the genre's that I like. Explore more overall genres, try one of each genre that I like. If you can, to make it look like a algorithmic feed. Please only return the identifier code and is found within the apostrophees in each song. Don't include any genre or anything. Please return it in a JSON object with the field songs, which contains an array of strings of the identifier code from each individual song.`;

    const prompts = [infoOne, infoTwo, paragraphInfo, attemptPrompt];
    let all = "";
    prompts.forEach((p) => (all += p + " "));

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_APIKEY,
    });

    const openai = new OpenAIApi(configuration);

    const request = await openai.createCompletion({
      model: "text-chat-davinci-002-20230126",
      prompt: all,
      temperature: 0.5,
      max_tokens: 600,
      stop: ["\n\n\n"],
    });

    let songs;
    try {
      songs = request.data.choices[0]?.text;
      //@ts-ignore
      songs = JSON.parse(songs.split("```")[1]?.split("```"[0]?.trim())).songs;
    } catch (error) {
      throw new TRPCError({ message: "openapi error", code: "BAD_REQUEST" });
    }

    return await Promise.all(
      songs.map(async (id: string) => {
        let data = await ctx.prisma.song.findFirst({
          where: { spotify_id: id },
          include: { artist: true },
        });

        if (!data)
          throw new TRPCError({
            message: "internal server error",
            code: "INTERNAL_SERVER_ERROR",
          });
        return {
          name: data.name,
          id: data.id,
          artist: data.artist?.map((artist) => ({
            name: artist.name,
            genres: artist.genres,
          })),
        };
      }),
    );
  }),
});

type SongForOpenAI = {
  name: string;
  id: string;
  artist: { name: string; genres: string[] }[];
};
