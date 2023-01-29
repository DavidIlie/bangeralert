import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";

import { api, RouterOutputs } from "../../../lib/api";
import { Button } from "../../Button";
import Input from "../../form/Input";
import Song, { BaseSong } from "..";
import { useLoadingStore } from "../../../stores/useLoadingStore";
import { linkRegex } from "../../../lib/constants";

const CreateByURL: React.FC = () => {
  const { push } = useRouter();

  const [songURL, setSongURL] = useState("");
  const [foundSong, setFoundSong] = useState<
    RouterOutputs["spotify"]["getSong"] | null
  >(null);

  const { toggleLoading } = useLoadingStore();

  const findSong = api.spotify.getSong.useMutation({
    onSuccess: (data) => {
      setFoundSong(data);
    },
  });

  const addSongMutation = api.spotify.create.useMutation({
    onSuccess: () => {
      push("/app");
    },
  });

  const doesSongAlreadyExist = foundSong !== null && (foundSong as any)._stars;

  return (
    <div>
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
      {foundSong && (
        <Button className="mt-2" onClick={() => setFoundSong(null)}>
          Reset
        </Button>
      )}
      <div className="mt-2" />
      {foundSong &&
        (doesSongAlreadyExist ? (
          <Song song={foundSong as any} disableSelfReview />
        ) : (
          <BaseSong song={foundSong as any} />
        ))}
      {foundSong && (
        <div className="mt-2">
          <Button
            className="w-full"
            onClick={async () =>
              await addSongMutation.mutateAsync({
                songId: foundSong.spotify_id,
              })
            }
          >
            Publish Song
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateByURL;
