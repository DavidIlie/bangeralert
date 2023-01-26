/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { MdOutlineExplicit } from "react-icons/md";

import DefaultLayout from "../../layouts/DefaultLayout";
import { Button } from "../../ui/Button";
import { api } from "../../lib/api";
import useTabActive from "../../hooks/useTabActive";

const App: NextPage = () => {
  const active = useTabActive();
  const audioRef = useRef<HTMLAudioElement>();
  const [delayHandler, setDelayHandler] = useState<any>(null);
  const [playHead, setPlayHead] = useState<{
    url: string;
    time: number;
  } | null>(null);
  const [playPreview, setPlayPreview] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (active && playPreview !== null) {
        audioRef.current?.pause();
        audioRef.current = new Audio(playPreview);
        audioRef.current.volume = 0.6;
        if (playHead?.url === playPreview)
          audioRef.current.currentTime = playHead.time;
        setPlayHead({ url: playPreview, time: 0 });
        audioRef.current.play();
      }
      if (playPreview === null) {
        let audio = audioRef.current!;
        setPlayHead({ url: playHead!.url, time: audio.currentTime });
        audio.pause();
      }
    } catch (error) {
      console.error("ERROR AUTOPLAYING SOUND PREVIEW", error);
    }
  }, [playPreview, active]);

  const utils = api.useContext();

  const createSongMutation = api.spotify.create.useMutation({
    onSuccess: (data) => {
      utils.feed.getFeed.invalidate();
      console.log(data);
    },
  });

  const { data } = api.feed.getFeed.useQuery();

  return (
    <DefaultLayout
      extraMiddleLayout={
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Your Feed</h1>
          <Button
            onClick={() => {
              let url = prompt("pls enter spotify song url");
              if (!url) return alert("wtf man");
              createSongMutation.mutate({ url: url! });
            }}
          >
            New Song
          </Button>
        </div>
      }
    >
      {data?.map((song) => (
        <div key={song.id}>
          {song.preview_url && (
            //@ts-ignore
            <audio ref={audioRef}>
              <source src={song.preview_url} />
            </audio>
          )}
          <Link href={`/app/song/${song.id}`}>
            <div
              className="mb-3 w-full rounded-lg bg-dark-containers px-2 py-4"
              onMouseEnter={() => {
                audioRef.current?.pause();
                setDelayHandler(
                  setTimeout(() => {
                    if (song.preview_url && active) {
                      setPlayPreview(song.preview_url);
                    }
                  }, 1500),
                );
              }}
              onMouseLeave={() => {
                clearTimeout(delayHandler);
                setPlayPreview(null);
              }}
            >
              <div className="flex gap-4">
                <img
                  src={song.album[0]?.cover_url}
                  className="w-1/4 rounded-md"
                  alt={`${song.name}-cover`}
                />
                <div>
                  <h1 className="font-medium">
                    {song.name.length > 22 ? (
                      <>
                        <p className="text-md md:text-xl">{song.name}</p>
                        <div className="flex items-center gap-0.5">
                          <p className="truncate text-xs text-gray-300">
                            ({song.album[0]?.name} -{" "}
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
                        <p className="mt-[0.2rem] truncate text-xs text-gray-300">
                          ({song.album[0]?.name} -{" "}
                          {song.album[0]?.artist[0]?.name})
                        </p>
                        {song.explicit && (
                          <MdOutlineExplicit className="mt-1 text-gray-300" />
                        )}
                      </div>
                    )}
                  </h1>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </DefaultLayout>
  );
};

export default App;
