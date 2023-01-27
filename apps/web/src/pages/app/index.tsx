/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { MdOutlineExplicit } from "react-icons/md";

import DefaultLayout from "../../layouts/DefaultLayout";
import { Button } from "../../ui/Button";
import { api } from "../../lib/api";
import SongPlayWrapper from "../../ui/song/SongPlayWrapper";
import StarRating from "../../ui/StarRating";

const App: NextPage = () => {
  const utils = api.useContext();

  const createSongMutation = api.spotify.create.useMutation({
    onSuccess: (data) => {
      utils.feed.getFeed.invalidate();
      console.log(data);
    },
  });

  const createSelfSongMutation =
    api.spotify.createCurrentlyListening.useMutation({
      onSuccess: (data) => {
        utils.feed.getFeed.invalidate();
        console.log(data);
      },
    });

  const { data } = api.feed.getFeed.useQuery();

  const transition = "hover:text-blue-500 duration-150";

  const songName = (song: any) => (
    <Link href={`/song/${song.id}`}>
      <p className={`text-md truncate md:text-xl ${transition}`}>{song.name}</p>
    </Link>
  );

  const songExtraDetails = (song: any) => (
    <div className="flex text-xs text-gray-300">
      (
      <Link href={`/album/${song.album[0]?.id}`}>
        <p className={transition}>{song.album[0]?.name}</p>
      </Link>
      <div className="mx-0.5">-</div>
      <Link href={`/artist/${song.album[0]?.artist[0]?.id}`}>
        <p className={transition}>{song.album[0]?.artist[0]?.name}</p>
      </Link>
      )
    </div>
  );

  return (
    <DefaultLayout
      extraMiddleLayout={
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Your Feed</h1>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => {
                let url = prompt("pls enter spotify song url");
                if (!url) return alert("wtf man");
                createSongMutation.mutate({ url: url! });
              }}
            >
              New Song
            </Button>
            <Button onClick={() => createSelfSongMutation.mutate()}>
              Song (wiap)
            </Button>
          </div>
        </div>
      }
    >
      {data?.map((song) => (
        <SongPlayWrapper
          previewUrl={song.preview_url}
          key={song.id}
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
              src={song.album[0]?.cover_url}
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
            <div className="mt-2">
              <StarRating
                stars={song._stars}
                starDimension="35px"
                starSpacing="5px"
              />
            </div>
          </div>
        </SongPlayWrapper>
      ))}
    </DefaultLayout>
  );
};

export default App;
