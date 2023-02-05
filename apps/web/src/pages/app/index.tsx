import * as React from "react";
import { useEffect } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useIntersection } from "@mantine/hooks";

import { Button } from "../../ui/Button";
import { api } from "../../lib/api";
import { AppLayout } from "../../layouts/AppLayout";
import Song from "../../ui/song";

const App: NextPage = () => {
  const { ref, entry } = useIntersection();

  const { data, fetchNextPage, isLoading } = api.feed.getFeed.useInfiniteQuery(
    {
      limit: 15,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  useEffect(() => {
    if (!isLoading && entry) fetchNextPage();
  }, [entry, fetchNextPage, isLoading]);

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
      {data?.pages.map((page) =>
        page.items.map((song) => <Song song={song as any} key={song.id} />),
      )}
      <div ref={ref}>
        <h1 className="invisible">Loading...</h1>
      </div>
    </AppLayout>
  );
};

export default App;
