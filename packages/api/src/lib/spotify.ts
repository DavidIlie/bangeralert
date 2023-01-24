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
): Promise<Response> =>
  await fetch(`https://api.spotify.com/v1/${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `application/json`,
    },
  });

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
