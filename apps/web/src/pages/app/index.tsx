import * as React from "react";
import type { NextPage } from "next";

import DefaultLayout from "../../layouts/DefaultLayout";
import { Button } from "../../ui/Button";
import { api } from "../../lib/api";

const App: NextPage = () => {
  const createSongMutation = api.spotify.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

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
      {Array.from(Array(50).keys()).map((_s, index) => (
        <div key={index}>Test {index}</div>
      ))}
    </DefaultLayout>
  );
};

export default App;
