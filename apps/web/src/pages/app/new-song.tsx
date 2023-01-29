import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { NextSeo } from "next-seo";

import { AppLayout } from "../../layouts/AppLayout";
import TabOption from "../../ui/tab/TabOption";
import TabBody from "../../ui/tab/TabBody";
import { api } from "../../lib/api";

import CreateByURL from "../../ui/song/create/CreateByURL";
import { useCreateReviewStore } from "../../stores/useCreateReviewStore";

const NewSong: NextPage = () => {
  const [tab, setTab] = useState(1);
  const { reset } = useCreateReviewStore();

  const { data, refetch } = api.spotify.currentListening.useQuery();

  const shouldByCurrentBeDisabled =
    typeof data !== "object" ? true : !data!.is_playing;

  useEffect(() => reset(), [reset, tab]);

  return (
    <>
      <NextSeo title="New Song" />
      <AppLayout
        extraMiddleLayout={
          <div>
            <h1 className="text-xl font-bold">Add a new song</h1>
          </div>
        }
      >
        <div className="flex justify-evenly">
          <TabOption self={1} current={tab} updateTab={setTab}>
            By URL
          </TabOption>
          <TabOption
            self={2}
            current={tab}
            updateTab={setTab}
            disabled={shouldByCurrentBeDisabled}
            onClick={() => refetch()}
            title={
              shouldByCurrentBeDisabled
                ? "You are not listening to anything!"
                : ""
            }
          >
            Currently Listening
          </TabOption>
          <TabOption self={3} current={tab} updateTab={setTab}>
            By Playlist
          </TabOption>
        </div>
        <TabBody current={tab} className="mt-3">
          <CreateByURL />
          <div>
            <h1>2</h1>
          </div>
          <div>
            <h1>3</h1>
          </div>
        </TabBody>
      </AppLayout>
    </>
  );
};

export default NewSong;
