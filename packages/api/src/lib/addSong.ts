import moment from "moment";
import { makeRequest, parseSong, SongResponseType } from "./spotify";

import { prisma } from "@acme/db";

export const getArtistData = async (artist: any, token: string) => {
  let r = await makeRequest(`artists/${artist.spotify_id}`, token);
  let extra = {};
  if (r.status === 200) {
    const response = await r.json();
    extra = {
      genres: response.genres as string[],
      followers: response.followers.total as number,
      popularity: response.popularity as number,
      cover_url: response.images[0].url || response.images.albumImageUrl || "",
    };
  }
  return {
    create: {
      spotify_id: artist.spotify_id,
      external_url: artist.external_url,
      name: artist.name,
      ...extra,
    },
    where: {
      spotify_id: artist.spotify_id,
    },
  };
};

export const addSongByObject = async (
  song: SongResponseType,
  token: string,
) => {
  let artistArray = [] as any;

  await Promise.all(
    song.artist.map(async (artist) => {
      artistArray.push(await getArtistData(artist, token));
    }),
  );

  const baseSong = {
    explicit: song.explicit,
    name: song.name,
    popularity: song.popularity,
    preview_url: song.preview_url,
    track_number: song.track_number,
    external_url: song.external_url,
  };

  let mainAlbumArtistData;

  const r = await makeRequest(`albums/${song.album.spotify_id}`, token);
  const apiReturnedAlbum = await r.json();

  const artist = apiReturnedAlbum.artists[0];

  mainAlbumArtistData = await getArtistData(
    {
      external_url: artist.external_urls.spotify,
      spotify_id: artist.id,
      name: artist.name,
    },
    token,
  );

  const createMainAlbumArtist = {
    spotify_id: song.album.spotify_id,
    name: song.album.name,
    external_url: song.album.external_url,
    cover_url: song.album.cover_url,
    release_date: moment(song.album.release_date).toDate(),
    total_tracks: song.album.total_tracks,
    artist: {
      connectOrCreate: mainAlbumArtistData,
    },
  };

  return await prisma.song.upsert({
    where: { spotify_id: song.spotify_id },
    update: {
      ...baseSong,
      album: {
        connectOrCreate: {
          create: createMainAlbumArtist,
          where: { spotify_id: song.album.spotify_id },
        },
      },
      artist: {
        connectOrCreate: artistArray.map((a: any) => a),
      },
    },
    create: {
      spotify_id: song.spotify_id,
      ...baseSong,
      album: {
        connectOrCreate: {
          create: createMainAlbumArtist,
          where: { spotify_id: song.album.spotify_id },
        },
      },
      artist: {
        connectOrCreate: artistArray.map((a: any) => a),
      },
    },
    include: {
      artist: true,
      album: true,
    },
  });
};

export const addSongById = async (id: string | undefined, token: string) => {
  const song = parseSong(
    await (await makeRequest(`tracks/${id}`, token)).json(),
  );
  return addSongByObject(song, token);
};
