import React from "react";
import { View, Text, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { signIn } from "next-auth/expo";

export const SignInScreen: React.FC = () => {
  const { data } = api.base.getDBSize.useQuery();
  const spotifyLogin = useAuth("spotify");

  return (
    <View className="flex h-full items-center justify-center">
      <View className="w-full sm:mx-auto sm:max-w-md">
        <Text className="text-center text-3xl font-bold text-white">
          BangerAlert
        </Text>
        <View className="my-4 bg-dark-containers">
          <Pressable
            className="flex justify-center gap-2 border border-green-900 bg-green-600 py-1"
            onPress={() => signIn(spotifyLogin)}
          >
            <Text className="mb-1.5 text-center text-xl font-bold text-white">
              <Entypo name="spotify" size={24} color="white" /> Sign in with
              Spotify
            </Text>
          </Pressable>
        </View>
        <Text
          className={`${
            typeof data !== "number" && "opacity-0"
          } text-center italic text-gray-500`}
        >
          Currently keeping track of <Text className="font-bold">{data}</Text>{" "}
          songs.
        </Text>
      </View>
    </View>
  );
};
