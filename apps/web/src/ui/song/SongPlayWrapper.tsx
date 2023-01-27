/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from "react-icons/ai";

import { api } from "../../lib/api";
import useTabActive from "../../hooks/useTabActive";

const SongPlayWrapper: React.FC<{
  children: React.ReactNode;
  previewUrl: string | null;
  className: string;
}> = ({ children, previewUrl, className, ...rest }) => {
  // TODO: MAKE TOGGLE SWITCH IN SETTINGS
  let enabledAutoPlay = true;

  const active = useTabActive();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [delayHandler, setDelayHandler] = useState<any>(null);
  const [playHead, setPlayHead] = useState<{
    url: string;
    time: number;
  } | null>(null);
  const [playPreview, setPlayPreview] = useState<string | null>(null);
  const [hasPaused, setHasPaused] = useState<boolean>(false);

  const [playingPreview, setPlayingPreview] = useState(false);

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
        setPlayHead({ url: playPreview || "", time: 0 });
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

  const handlePlayAudio = async () => {
    if (previewUrl && active) {
      resumeClient.reset();
      await pauseClientIfPlaying.mutateAsync({
        // self device ID for test
        deviceId: "ae1df4d83625c1db6007e75ca736c7845d59eae9",
      });
      setPlayPreview(previewUrl);
    }
  };

  const handleStopAudio = async () => {
    if (hasPaused)
      await resumeClient.mutateAsync({
        // self device ID for test
        deviceId: "ae1df4d83625c1db6007e75ca736c7845d59eae9",
      });
    setHasPaused(false);
    setPlayPreview(null);
  };

  return (
    <div
      {...rest}
      onMouseEnter={async () => {
        audioRef.current?.pause();
        if (!enabledAutoPlay) return;
        setDelayHandler(
          setTimeout(async () => {
            await handlePlayAudio();
          }, 1500),
        );
      }}
      onMouseLeave={async () => {
        if (!enabledAutoPlay) return;
        clearTimeout(delayHandler);
        await handleStopAudio();
      }}
      className={`${className}`}
    >
      {previewUrl && (
        <audio ref={audioRef}>
          <source src={previewUrl} />
        </audio>
      )}
      {!enabledAutoPlay && (
        <div className="cursor-pointer">
          {playingPreview ? (
            <AiOutlinePauseCircle
              onClick={async () => {
                await handleStopAudio();
                setPlayingPreview(false);
              }}
            />
          ) : (
            <AiOutlinePlayCircle
              onClick={async () => {
                handlePlayAudio();
                setPlayingPreview(true);
              }}
            />
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default SongPlayWrapper;
