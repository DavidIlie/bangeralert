/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Link from "next/link";

import { defaultDivProps } from "../defaultProps";
import { api, RouterOutputs } from "../../lib/api";
import SongPlayWrapper from "./SongPlayWrapper";
import { MdOutlineExplicit } from "react-icons/md";
import { SongResponseType } from "@acme/api/src/lib/spotify";
import SongStars from "./SongStars";

type Unpacked<T> = T extends (infer U)[] ? U : T;
export type SongType = Unpacked<RouterOutputs["feed"]["getFeed"]>;

export const BaseSong: React.FC<{
  song: SongResponseType;
  embedLinks?: { song: string; album: string; artist: string };
  children?: React.ReactNode;
}> = ({ song, embedLinks, children }) => {
  const transition = "hover:text-blue-500 duration-150";

  const songName = (song: SongResponseType | SongType["items"][0]) =>
    embedLinks ? (
      <Link href={embedLinks.song}>
        <p className={`text-md truncate md:text-xl ${transition}`}>
          {song.name}
        </p>
      </Link>
    ) : (
      <p className={`text-md truncate md:text-xl ${transition}`}>{song.name}</p>
    );

  const songExtraDetails = (song: SongResponseType) => (
    <div className="flex text-xs text-gray-300">
      ({" "}
      {embedLinks ? (
        <Link href={embedLinks.album}>
          <p className={transition}>{(song as any).album[0]?.name}</p>
        </Link>
      ) : (
        <p className={transition}>{song.album?.name}</p>
      )}
      <div className="mx-0.5">-</div>
      {embedLinks ? (
        <Link href={`/artist/${(song as any).artist[0]?.id}`}>
          <p className={transition}>{song.artist[0]?.name}</p>
        </Link>
      ) : (
        <p className={transition}>{song.artist[0]?.name}</p>
      )}
      )
    </div>
  );

  return (
    <SongPlayWrapper
      previewUrl={song.preview_url}
      songId={song.spotify_id}
      className="mb-3 flex w-full gap-4 rounded-lg bg-dark-containers px-2 py-3"
    >
      <a
        href={song.external_url}
        target="_blank"
        rel="noreferrer"
        className="w-1/4"
      >
        <img
          src={
            embedLinks
              ? (song as any).album[0]?.cover_url
              : song.album.cover_url
          }
          className="rounded-md"
          alt={`${song.name}-cover`}
        />
      </a>
      <div>
        <div className="font-medium">
          {song.name.length > 20 ? (
            <>
              {songName(song)}
              <div className="flex items-center gap-0.5">
                {songExtraDetails(song)}
                {song.explicit && (
                  <MdOutlineExplicit className="mt-[0.05rem] text-gray-300" />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1">
              {songName(song)}
              <div className="mt-[0.2rem]">{songExtraDetails(song)}</div>
              {song.explicit && (
                <MdOutlineExplicit className="mt-1 text-gray-300" />
              )}
            </div>
          )}
        </div>
        {children}
      </div>
    </SongPlayWrapper>
  );
};

const Song: React.FC<
  defaultDivProps & { song: SongType["items"][0]; disableSelfReview?: boolean }
> = ({ song, disableSelfReview = false, ...rest }) => {
  const utils = api.useContext();

  const giveRating = api.song.addRating.useMutation({
    onSuccess: () => utils.feed.getFeed.invalidate(),
  });

  return (
    <BaseSong
      song={song as any}
      embedLinks={{
        song: `/song/${song.id}`,
        album: `/album/${song.album[0]?.id}`,
        artist: `/artist/${song.artist[0]?.id}`,
      }}
      {...rest}
    >
      <div className="mt-2">
        <SongStars
          stars={song._stars}
          onClick={() => {
            if (disableSelfReview) return;

            const ratingPrompt = prompt("what do u think of this song");
            if (!ratingPrompt) return alert("wtf man");

            let rating = 0;
            try {
              rating = parseInt(ratingPrompt);
            } catch (error) {}

            if (rating > 5 || rating < 0) return alert("wtf man");

            giveRating.mutate({
              songId: song.id,
              rating,
            });
          }}
        />
      </div>
    </BaseSong>
  );
};

export default Song;
