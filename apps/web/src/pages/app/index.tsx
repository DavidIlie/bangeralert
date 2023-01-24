import * as React from "react";
import type { NextPage } from "next";

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
        <div
          key={index}
          className="w-full px-2 py-4 mb-4 border-2 border-gray-900 rounded-md bg-dark-containers"
        >
          <h1 className="font-medium">{song.name}</h1>
        </div>
      ))}
    </DefaultLayout>
  );
};

export default App;
