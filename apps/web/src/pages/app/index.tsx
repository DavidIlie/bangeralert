/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Link from "next/link";
import type { NextPage } from "next";

import { Button } from "../../ui/Button";
import { api } from "../../lib/api";
import { AppLayout } from "../../layouts/AppLayout";
import Song from "../../ui/song";

const App: NextPage = () => {
  const { data } = api.feed.getFeed.useQuery();

  return (
    <AppLayout
      extraMiddleLayout={
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Your Feed</h1>
          <div className="flex items-center gap-1">
            <Link href="/app/new-song">
              <Button>New Song</Button>
            </Link>
          </div>
        </div>
      }
    >
      {data?.map((song) => (
        <Song song={song} key={song.id} />
      ))}
    </AppLayout>
  );
};

export default App;
