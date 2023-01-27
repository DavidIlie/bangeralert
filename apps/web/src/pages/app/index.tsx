/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { MdOutlineExplicit } from "react-icons/md";

import DefaultLayout from "../../layouts/DefaultLayout";
import { Button } from "../../ui/Button";
import { api } from "../../lib/api";
import SongPlayWrapper from "../../ui/song/SongPlayWrapper";

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

  console.log(data);

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
                  <p className="text-md truncate md:text-xl">{song.name}</p>
                  <div className="flex items-center gap-0.5">
                    <p className="text-xs text-gray-300">
                      ({song.album[0]?.name}
                      {" - "}
                      {song.album[0]?.artist[0]?.name})
                    </p>
                    {song.explicit && (
                      <MdOutlineExplicit className="mt-[0.05rem] text-gray-300" />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <p className="text-md md:text-xl">{song.name}</p>
                  <p className="mt-[0.2rem] text-xs text-gray-300">
                    ({song.album[0]?.name} - {song.album[0]?.artist[0]?.name})
                  </p>
                  {song.explicit && (
                    <MdOutlineExplicit className="mt-1 text-gray-300" />
                  )}
                </div>
              )}
            </div>
          </div>
        </SongPlayWrapper>
      ))}
    </DefaultLayout>
  );
};

export default App;
