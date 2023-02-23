import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ChatGPTAPI } from "chatgpt";

import { spotifyProcedure, createTRPCRouter } from "../trpc";
import { addSongById, addSongByObject } from "../lib/addSong";
import {
  makeRequest,
  parseSong,
  SongResponseType,
  basicIncludeForSong,
  embedStarAvgToSong,
} from "../lib/spotify";
import { parseSpotifyUrl } from "../lib/parseSpotifyUrl";

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
        return embedStarAvgToSong<typeof prismaSong>(prismaSong);
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
      let songId = parseSpotifyUrl(input.url);

      const prismaSong = await ctx.prisma.song.findFirst({
        where: { spotify_id: songId },
        include: basicIncludeForSong(ctx.session.user.id),
      });

      if (prismaSong) {
        return embedStarAvgToSong<typeof prismaSong>(prismaSong);
      }

      return parseSong(
        await (await makeRequest(`tracks/${songId}`, ctx.spotifyToken)).json(),
      );
    }),
  createPlaylist: spotifyProcedure
    // .input(z.object({ playlistId: z.string() }))
    .query(async ({ ctx }) => {
      if (process.env.NODE_ENV === "production")
        throw new TRPCError({ message: "no can do", code: "BAD_REQUEST" });

      let playlistUrl =
        "https://open.spotify.com/playlist/7vDCASxFXQoLCPj4xANDMa?si=40dc23514fda45d9";
      let id = parseSpotifyUrl(playlistUrl, "playlist");

      let playlist;
      try {
        playlist = await (
          await makeRequest(`playlists/${id}`, ctx.spotifyToken)
        ).json();
      } catch (error) {
        throw new TRPCError({
          message: "couldn't find playlist",
          code: "BAD_REQUEST",
        });
      }

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
          private: !playlist.public,
          name: playlist.name,
          ...extraWhere,
        },
        update: {
          spotify_id: playlist.id,
          description: playlist.description,
          photo: playlist.images[0].url,
          followers: playlist.followers.total,
          spotify_url: playlist.external_urls.spotify,
          collaborative: playlist.collaborative,
          private: !playlist.public,
          name: playlist.name,
          ...extraWhere,
        },
      });

      const promises = [];
      for (let i = 0; i < playlist.tracks.total; i += 50) {
        let limit = 50;
        if (i + 50 >= playlist.tracks.total) {
          limit = playlist.tracks.total - i;
        }
        promises.push(
          makeRequest(
            `playlists/${id}/tracks?offset=${i}&limit=${limit}`,
            ctx.spotifyToken,
          ),
        );
      }

      const responses = await Promise.all(promises);

      const notGroupedData = await Promise.all(
        responses.map(async (res) => {
          const response = await res.json();

          return response;
        }),
      );

      let allSongs = [] as SongResponseType[];

      notGroupedData.map((s) => {
        s.items.map(
          (song: any) =>
            song.track.available_markets.length !== 0 &&
            allSongs.push(parseSong(song.track)),
        );
      });

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
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const allDBSongsId = await ctx.prisma.song.findMany({
        where: {
          spotify_id: { in: allSongs.map((s) => s.spotify_id) },
        },
        select: { id: true, spotify_id: true },
      });

      await ctx.prisma.$transaction(
        allDBSongsId.map((song) => {
          return ctx.prisma.playlistSongLink.upsert({
            where: {
              songId: song.spotify_id,
            },
            update: {
              songId: song.spotify_id,
            },
            create: {
              songId: song.spotify_id,
              playlistId: prismaPlaylist.spotify_id,
            },
          });
        }),
      );

      return allSongs;
    }),
  openai: spotifyProcedure.query(async ({ ctx }) => {
    if (process.env.NODE_ENV === "production")
      throw new TRPCError({ message: "no can do", code: "BAD_REQUEST" });

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

    let howManyRandomSongs = 300;
    const howManyToPick = 15;

    let unlistenedSongs = [] as any[];

    while (unlistenedSongs.length !== howManyRandomSongs) {
      const ids = (
        await ctx.prisma.$queryRaw<
          {
            id: string;
          }[]
        >`SELECT id FROM public."Song" ORDER BY random() LIMIT ${howManyRandomSongs}`
      ).map((r) => r.id);

      const randomSongs = (
        await ctx.prisma.song.findMany({
          where: { id: { in: ids } },
          take: howManyRandomSongs,
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

      for (const song of randomSongs) {
        if (unlistenedSongs.length === howManyRandomSongs) break;

        // const isSaved = (await (
        //   await makeRequest(
        //     `me/tracks/contains?ids=${song.id}`,
        //     ctx.spotifyToken,
        //   )
        // ).json()) as boolean[];

        const checkIfInPlaylist = await ctx.prisma.playlistSongLink.findFirst({
          where: {
            songId: song.id,
            playlist: { userId: ctx.session.user.id },
          },
        });

        let passFeed = false;
        const checkIfInFeed = await ctx.prisma.feedSong.findFirst({
          where: { songId: song.id, userId: ctx.session.user.id },
        });

        if (!checkIfInFeed) {
          passFeed = true;
        } else {
          if (!checkIfInFeed?.hasInteracted) {
            await ctx.prisma.feedSong.delete({
              where: { id: checkIfInFeed?.id },
            });
            passFeed = true;
          } else {
            passFeed = false;
          }
        }

        if (
          // (!isSaved[0] && unlistenedSongs.length !== take) ||
          !checkIfInPlaylist
        ) {
          if (!passFeed) return;
          console.log("ADDING UNLISTENED SONG", song.name, song.id);
          unlistenedSongs.push(song);
          console.log(unlistenedSongs.length);
        } else {
          console.log("DIDNT PICK THIS ONE", song.name, song.id);
        }

        // await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    function formatSongs(songs: any[], index: number): string {
      const songLines = songs.map((song, i) => {
        const artists = song.artist
          .map((artist: any) => artist.name)
          .join(", ");
        const genres = [
          ...new Set(song.artist.flatMap((artist: any) => artist.genres)),
        ].join(", ");
        return `${song.name} with its identifier code is '${
          index - i
        }' by ${artists} with the genres ${genres}`;
      });
      return songLines.join(". ");
    }

    const infoOne = `DONT SAY ANYTHING JUST REMEMBER PLEASE!! JUST Read this: My top artists and their respective genres are: ${artistsString}. DO NOT REPLY PLEASE. Please don't say anything back, just keep this in mind for the next query.`;
    const infoSongs = (songs: string) =>
      `DONT SAY ANYTHING JUST REMEMBER PLEASE!! Here are some songs: ${songs}. Please don't respond at all, just keep it in mind for my next prompt. DO NOT SAY ANYTHING`;
    const paragraphInfo = `With that information, the first prompt shows my top artists and their respective genre's. Keep that in mind. Now the next ${
      unlistenedSongs.length / 50
    } prompt contains 50 random songs with their own respective genre, keep that in mind their genre and its identifier code. Please do not respond at all to what I just said, just keep it in mind.`;
    const attemptPrompt = `From the last prompt, try and pick ${howManyToPick} songs given the artist and genres that you think I might enjoy. Please scan through all of them and don't make up your mind fast. Explore more overall genres, try one of each genre that I like. Please only return (no words no anything) the identifier code and is found within the apostrophees in each song. Please return as an array of numbers of the identifier code from each individual song.`;

    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_APIKEY!,
    });

    console.log("STARTING OPENAI CONNECTION");

    let songs = [] as string[];

    const firstPrompt = await api.sendMessage(infoOne);
    let conversationId = firstPrompt.conversationId!;
    let parentMessageId = firstPrompt.parentMessageId!;
    console.log("FIRST PROMPT:", firstPrompt.text);

    for (let i = 0; i < unlistenedSongs.length; i += 50) {
      let batch = unlistenedSongs.slice(i, i + 50);
      const prompt = await api.sendMessage(
        infoSongs(formatSongs(batch, i + 50)),
        {
          conversationId,
          parentMessageId,
        },
      );
      parentMessageId = prompt.id;
      conversationId = prompt.conversationId!;
      console.log("PRE-PROMPT SONGS:", prompt.text, i + 50);

      const secondPrompt = await api.sendMessage(paragraphInfo, {
        conversationId,
        parentMessageId,
      });
      conversationId = secondPrompt.conversationId!;
      parentMessageId = secondPrompt.parentMessageId!;
      console.log("PRE-PROMPT INFO:", secondPrompt.text, i + 50);

      const res = await api.sendMessage(attemptPrompt, {
        conversationId,
        parentMessageId,
        onProgress: (partialResponse) => console.log(partialResponse.text),
      });
      parentMessageId = res.id;
      conversationId = res.conversationId!;
      try {
        songs = [
          ...songs,
          JSON.parse(res.text.substring(0, res.text.length - 1)),
        ];
      } catch (error) {
        songs = [...songs, JSON.parse(res.text)];
      }
    }

    songs = [].concat(...(songs as any));
    songs = [...new Set(songs.map((s) => unlistenedSongs[parseInt(s) - 1].id))];

    await ctx.prisma.$transaction(
      songs.map((id: string) =>
        ctx.prisma.feedSong.create({
          data: {
            songId: id,
            userId: ctx.session.user.id,
            specialId: `${id}-${ctx.session.user.id}`,
          },
        }),
      ),
    );

    return songs;
  }),
});
