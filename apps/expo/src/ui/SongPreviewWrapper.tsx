import * as React from "react";
import { useState, useEffect } from "react";
import { Audio } from "expo-av";

import { Song } from ".prisma/client";
import { Pressable } from "react-native";

const SongPreviewWrapper: React.FC<{
  song: Song;
  children: React.ReactNode;
}> = ({ song, children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  useEffect(() => {
    const playSound = async () => {
      if (song.preview_url) {
        const { sound: objectSound } = await Audio.Sound.createAsync({
          uri: song.preview_url!,
        });
        setSound(objectSound);
      }
    };
    playSound();
  }, []);

  console.log(sound);

  //   useEffect(() => {
  //     return sound
  //       ? () => {
  //           console.log("Unloading Sound");
  //           sound.unloadAsync();
  //         }
  //       : undefined;
  //   }, [sound]);

  return (
    <Pressable
      onPress={async () => {
        sound?.playAsync();
      }}
    >
      {children}
    </Pressable>
  );
};

export default SongPreviewWrapper;
