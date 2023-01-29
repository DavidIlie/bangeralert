import * as React from "react";
import { useState } from "react";

import { api, RouterOutputs } from "../../../lib/api";
import { Button } from "../../Button";
import Input from "../../form/Input";
import { useLoadingStore } from "../../../stores/useLoadingStore";
import { linkRegex } from "../../../lib/constants";
import { useCreateReviewStore } from "../../../stores/useCreateReviewStore";
import BaseSongAdder from "../BaseSongAdder";

const CreateByURL: React.FC = () => {
  const { toggleLoading } = useLoadingStore();
  const { setHasReview, setSelfReview, setOgReview } = useCreateReviewStore();

  const [songURL, setSongURL] = useState("");
  const [foundSong, setFoundSong] = useState<
    RouterOutputs["spotify"]["getSong"] | null
  >(null);

  const doesSongAlreadyExist = foundSong !== null && (foundSong as any)._stars;

  const getRatings = api.song.getRating.useMutation();

  const findSong = api.spotify.getSong.useMutation({
    onSuccess: async (songData) => {
      setFoundSong(songData);
      if (!doesSongAlreadyExist) {
        return setHasReview(false);
      }
      let id;
      try {
        id = (songData as any).id;
      } catch (error) {
        return;
      }
      const data = await getRatings.mutateAsync({ songId: id });
      if (!data) return;
      setSelfReview(data.rating);
      setOgReview(data.rating);
    },
  });

  return (
    <div>
      {!foundSong && (
        <>
          <h1 className="text-lg font-medium">Find a song by URL</h1>
          <form
            onSubmit={async (e) => {
              toggleLoading();
              e.preventDefault();
              await findSong.mutateAsync({ url: songURL });
              setSongURL("");
              toggleLoading();
            }}
            className="mt-2 flex gap-2"
          >
            <Input
              className="w-4/5 placeholder:text-gray-300 placeholder:text-opacity-20"
              type="url"
              value={songURL}
              onChange={(e) => setSongURL(e.target.value)}
              onFocus={() => setFoundSong(null)}
              placeholder="https://open.spotify.com/track/69uxyAqqPIsUyTO8txoP2M"
            />
            <Button
              className="w-1/5"
              type="submit"
              disabled={!linkRegex.test(songURL)}
              title="Find Song"
            >
              Find
            </Button>
          </form>
        </>
      )}
      {foundSong && (
        <Button
          className="mt-2"
          onClick={() => {
            setFoundSong(null);
            setOgReview(0);
            setSelfReview(0);
          }}
        >
          Reset
        </Button>
      )}
      <div className="mt-2" />
      {foundSong && <BaseSongAdder song={foundSong} />}
    </div>
  );
};

export default CreateByURL;
