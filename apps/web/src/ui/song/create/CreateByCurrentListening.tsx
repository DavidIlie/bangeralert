/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useState, useEffect } from "react";

import { api, RouterOutputs } from "../../../lib/api";
import { Button } from "../../Button";
import BaseSongAdder from "../BaseSongAdder";

const CreateByCurrentListening: React.FC = () => {
  const utils = api.useContext();
  const [data, setData] = useState<
    RouterOutputs["spotify"]["currentlyListening"] | null
  >(null);

  const getSong = api.spotify.currentlyListening.useMutation();

  useEffect(() => {
    const getData = async () => {
      const response = await getSong.mutateAsync();
      setData(response);
    };
    getData();
  }, []);

  return (
    <div>
      <Button
        onClick={async (e) => {
          const response = await getSong.mutateAsync();
          setData(response);
          utils.spotify.currentListeningBoolean.invalidate();
        }}
        className="my-2"
      >
        Refresh
      </Button>
      {!data || getSong.isLoading ? (
        <div>Loading...</div>
      ) : (
        <BaseSongAdder song={data as any} />
      )}
    </div>
  );
};
export default CreateByCurrentListening;
