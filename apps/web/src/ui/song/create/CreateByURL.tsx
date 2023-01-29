import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";

import { api, RouterOutputs } from "../../../lib/api";
import { Button } from "../../Button";
import Input from "../../form/Input";
import Song, { BaseSong } from "..";
import { useLoadingStore } from "../../../stores/useLoadingStore";
import { linkRegex } from "../../../lib/constants";
import SongStars from "../SongStars";
import Radio from "../../form/Radio";

const CreateByURL: React.FC = () => {
  const { push } = useRouter();
  const { toggleLoading } = useLoadingStore();

  const [songURL, setSongURL] = useState("");
  const [foundSong, setFoundSong] = useState<
    RouterOutputs["spotify"]["getSong"] | null
  >(null);

  const [hasReview, setHasReview] = useState(true);
  const [selfReview, setSelfReview] = useState(0);
  const [ogReview, setOgReview] = useState(0);

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

  const addReview = api.song.addRating.useMutation({
    onSuccess: () => push("/app"),
  });

  const addSong = api.spotify.create.useMutation({
    onSuccess: async (id) => {
      if (hasReview)
        return await addReview.mutateAsync({ songId: id, rating: selfReview });
      push("/app");
    },
  });

  const doesSongAlreadyExist = foundSong !== null && (foundSong as any)._stars;

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
      {foundSong &&
        (doesSongAlreadyExist ? (
          <Song song={foundSong as any} disableSelfReview />
        ) : (
          <BaseSong song={foundSong as any} />
        ))}
      {foundSong && (
        <div className="mt-4">
          {hasReview ? (
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Rating: </h1>
              <SongStars
                stars={selfReview}
                onClick={() => {
                  const ratingPrompt = prompt("what do u think of this song");
                  if (!ratingPrompt) return alert("wtf man");

                  let rating = 0;
                  try {
                    rating = parseInt(ratingPrompt);
                  } catch (error) {}

                  if (rating > 5 || rating < 0) return alert("wtf man");

                  setSelfReview(rating);
                }}
              />
              <Button
                onClick={() => {
                  setHasReview(false);
                  setSelfReview(ogReview);
                }}
              >
                Remove Review
              </Button>
            </div>
          ) : (
            <Radio
              label="Add Review"
              checked={hasReview}
              onClick={() => setHasReview(true)}
            />
          )}
          <Button
            className="mt-4 w-full"
            disabled={doesSongAlreadyExist ? !hasReview : false}
            onClick={async () =>
              await addSong.mutateAsync({
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
