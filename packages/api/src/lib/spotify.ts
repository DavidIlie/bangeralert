import { TRPCError } from "@trpc/server";

import { Song, Star } from "@acme/db";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
export const genSpotifyAuthHeaders = btoa(`${client_id}:${client_secret}`);

interface accessTokenType {
  access_token: string;
  expires_in: number;
}

export const getAccessToken = async (
  refreshToken: string,
): Promise<accessTokenType> => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: `POST`,
    headers: {
      Authorization: `Basic ${genSpotifyAuthHeaders}`,
      "Content-Type": `application/x-www-form-urlencoded`,
    },
    body: new URLSearchParams({
      grant_type: `refresh_token`,
      refresh_token: refreshToken,
    }),
  });
  return (await response.json()) as any as accessTokenType;
};

export const makeRequest = async (
  path: string,
  accessToken: string,
  method = "GET" as
    | "POST"
    | "GET"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "OPTIONS"
    | "HEAD",
  query?: any,
): Promise<Response> => {
  console.log(`REQUEST: ${path}`);
  try {
    const r = await fetch(`https://api.spotify.com/v1/${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `application/json`,
      },
      ...query,
    });

    if (r.status === 429)
      throw new TRPCError({
        message: "rate limited by spotify",
        code: "TOO_MANY_REQUESTS",
      });

    return r;
  } catch (error) {
    console.log(error);
    throw new TRPCError({
      message: "fetch error - check console",
      code: "TOO_MANY_REQUESTS",
    });
  }
};

export interface SongResponseType {
  spotify_id: string;
  explicit: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  external_url: string;
  album: {
    spotify_id: string;
    external_url: string;
    cover_url: string;
    name: string;
    release_date: string;
    total_tracks: number;
  };
  artist: {
    spotify_id: string;
    external_url: string;
    name: string;
  }[];
}

export const parseSong = (apiResponse: any): SongResponseType =>
  ({
    spotify_id: apiResponse.id,
    explicit: apiResponse.explicit,
    name: apiResponse.name,
    popularity: apiResponse.popularity,
    preview_url: apiResponse.preview_url,
    track_number: apiResponse.track_number,
    external_url: apiResponse.external_urls.spotify,
    album: {
      spotify_id: apiResponse.album.id,
      external_url: apiResponse.album.external_urls.spotify,
      cover_url:
        apiResponse.album.images[0].url ||
        apiResponse.album.albumImageUrl ||
        "",
      name: apiResponse.album.name,
      release_date: apiResponse.album.release_date,
      total_tracks: apiResponse.album.total_tracks,
    },
    artist: (apiResponse.artists as any[]).map((artist) => ({
      spotify_id: artist.id,
      name: artist.name,
      external_url: artist.external_urls.spotify,
    })),
  } as any as SongResponseType);

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

export const embedStarAvgToSong = <T>(song: T | (Song & { stars: Star[] })) => {
  const starsArray = (song as any).stars.map((star: T) => (star as any).rating);
  const sum = starsArray.reduce((a: any, b: any) => a + b, 0);
  (song as any)._stars = sum / starsArray.length || 0;
  return song as T & { _stars: number };
};
