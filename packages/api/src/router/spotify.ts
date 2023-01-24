import { z } from "zod";
import { spotifyProcedure, createTRPCRouter } from "../trpc";

import { makeRequest, parseSong } from "../lib/spotify";
import moment from "moment";

export const spotifyRouter = createTRPCRouter({
  create: spotifyProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const songId = input.url
        .split("https://open.spotify.com/track/")[1]
        ?.split("?si=")[0];

      const song = parseSong(
        await (await makeRequest(`tracks/${songId}`, ctx.spotifyToken)).json(),
      );

      await Promise.all(
        song.artist.map(async (artist) => {
          let r = await makeRequest(
            `artists/${artist.spotify_id}`,
            ctx.spotifyToken,
          );
          let extra = {};
          if (r.status === 200) {
            const response = await r.json();
            extra = {
              genres: response.genres as string[],
              followers: response.followers.total as number,
              popularity: response.popularity as number,
              cover_url:
                response.images[0].url || response.images.albumImageUrl || "",
            };
          }

          const baseSong = {
            explicit: song.explicit,
            name: song.name,
            popularity: song.popularity,
            preview_url: song.preview_url,
            track_number: song.track_number,
            external_url: song.external_url,
          };

          const create = {
            spotify_id: song.album.spotify_id,
            name: song.album.name,
            external_url: song.album.external_url,
            cover_url: song.album.cover_url,
            release_date: moment(song.album.release_date).toDate(),
            total_tracks: song.album.total_tracks,
            artist: {
              connectOrCreate: {
                create: {
                  spotify_id: artist.spotify_id,
                  external_url: artist.external_url,
                  name: artist.name,
                  ...extra,
                },
                where: {
                  spotify_id: artist.spotify_id,
                },
              },
            },
          };

          await ctx.prisma.song.upsert({
            where: { spotify_id: song.spotify_id },
            update: {
              ...baseSong,
              album: {
                connectOrCreate: {
                  create,
                  where: { spotify_id: song.album.spotify_id },
                },
              },
            },
            create: {
              spotify_id: song.spotify_id,
              ...baseSong,
              album: {
                connectOrCreate: {
                  create,
                  where: { spotify_id: song.album.spotify_id },
                },
              },
            },
          });
        }),
      );

      return true;
    }),
});
