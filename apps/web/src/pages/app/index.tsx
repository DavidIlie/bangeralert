/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { MdOutlineExplicit } from "react-icons/md";

import DefaultLayout from "../../layouts/DefaultLayout";
import { Button } from "../../ui/Button";
import { api } from "../../lib/api";

const App: NextPage = () => {
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
      {data?.map((song, index) => (
        <Link href={`/app/song/${song.id}`} key={index}>
          <div className="w-full px-2 py-4 mb-3 rounded-lg bg-dark-containers">
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
                        <p className="text-xs text-gray-300 truncate">
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
      ))}
    </DefaultLayout>
  );
};

export default App;
