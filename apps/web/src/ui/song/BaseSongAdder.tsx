import * as React from "react";
import { useRouter } from "next/router";

import Song, { BaseSong } from ".";
import { api, RouterOutputs } from "../../lib/api";
import { Button } from "../Button";
import Radio from "../form/Radio";
import SongStars from "./SongStars";
import { useLoadingStore } from "../../stores/useLoadingStore";
import { useCreateReviewStore } from "../../stores/useCreateReviewStore";

const BaseSongAdder: React.FC<{
  song: RouterOutputs["spotify"]["getSong"];
}> = ({ song }) => {
  const { push } = useRouter();
  const { toggleLoading } = useLoadingStore();

  const { hasReview, selfReview, setSelfReview, setHasReview, ogReview } =
    useCreateReviewStore();

  const addReview = api.song.addRating.useMutation({
    onSuccess: () => {
      toggleLoading();
      push("/app");
    },
  });

  const addSong = api.spotify.create.useMutation({
    onSuccess: async (id) => {
      if (hasReview)
        return await addReview.mutateAsync({ songId: id, rating: selfReview });
      toggleLoading();
      push("/app");
    },
  });

  const doesSongAlreadyExist = song !== null && (song as any)._stars;

  return (
    <div>
      {doesSongAlreadyExist ? (
        <Song song={song as any} disableSelfReview />
      ) : (
        <BaseSong song={song as any} />
      )}
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
          onClick={async () => {
            toggleLoading();
            await addSong.mutateAsync({
              songId: song.spotify_id,
            });
          }}
        >
          Publish Song
        </Button>
      </div>
    </div>
  );
};

export default BaseSongAdder;
