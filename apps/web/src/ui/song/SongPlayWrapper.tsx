/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useState, useEffect, useRef } from "react";

import { api } from "../../lib/api";
import useTabActive from "../../hooks/useTabActive";

const SongPlayWrapper: React.FC<{
  children: React.ReactNode;
  previewUrl: string | null;
  className: string;
}> = ({ children, previewUrl, className, ...rest }) => {
  const active = useTabActive();
  const audioRef = useRef<HTMLAudioElement>();
  const [delayHandler, setDelayHandler] = useState<any>(null);
  const [playHead, setPlayHead] = useState<{
    url: string;
    time: number;
  } | null>(null);
  const [playPreview, setPlayPreview] = useState<string | null>(null);
  const [hasPaused, setHasPaused] = useState<boolean>(false);

  const pauseClientIfPlaying =
    api.spotify.ifCurrentlyListeningThenPauseSong.useMutation({
      onSuccess: (data) => {
        if (data) setHasPaused(true);
      },
    });

  const resumeClient = api.spotify.resumePlayback.useMutation();

  useEffect(() => {
    try {
      if (active && playPreview !== null) {
        let audio = audioRef.current!;
        audio.pause();
        audio.volume = 0.6;
        if (playHead?.url === playPreview) audio.currentTime = playHead.time;
        setPlayHead({ url: playPreview, time: 0 });
        audio.play();
      }
      if (playPreview === null) {
        let audio = audioRef.current!;
        try {
          setPlayHead({ url: playHead!.url, time: audio.currentTime });
        } catch (error) {}
        audio.pause();
      }
    } catch (error) {
      console.error("ERROR AUTOPLAYING SOUND PREVIEW", error);
    }
  }, [playPreview, active]);

  return (
    <div
      {...rest}
      onMouseEnter={async () => {
        audioRef.current?.pause();
        setDelayHandler(
          setTimeout(async () => {
            if (previewUrl && active) {
              resumeClient.reset();
              await pauseClientIfPlaying.mutateAsync({
                // self device ID for test
                deviceId: "ae1df4d83625c1db6007e75ca736c7845d59eae9",
              });
              setPlayPreview(previewUrl);
            }
          }, 1500),
        );
      }}
      onMouseLeave={async () => {
        clearTimeout(delayHandler);
        if (hasPaused)
          await resumeClient.mutateAsync({
            // self device ID for test
            deviceId: "ae1df4d83625c1db6007e75ca736c7845d59eae9",
          });
        setHasPaused(false);
        setPlayPreview(null);
      }}
      className={className}
    >
      {previewUrl && (
        //@ts-ignore
        <audio ref={audioRef}>
          <source src={previewUrl} />
        </audio>
      )}
      {children}
    </div>
  );
};

export default SongPlayWrapper;
