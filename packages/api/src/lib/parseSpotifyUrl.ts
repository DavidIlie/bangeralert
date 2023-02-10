export const parseSpotifyUrl = (
  url: string,
  base: "playlist" | "song" | "album" | "artist" = "song",
): string => {
  let songId;
  try {
    songId = url
      .split(`https://open.spotify.com/${base}/`)[1]
      ?.split("?si=")[0];
  } catch (error) {
    throw new Error("wrong url");
  }
  return songId!;
};
