import React from "react";
import { Pressable, Text, View } from "react-native";
import { signIn, useSession, signOut } from "next-auth/expo";

import { useAuth } from "../lib/auth";

export const HomeScreen = () => {
  const spotifyLogin = useAuth("spotify");
  const { status, data } = useSession();
  return (
    <Text className="text-white">
      Logged in as {data?.user?.name},{" "}
      <Text onPress={() => signOut()} className="font-medium">
        Sign Out
      </Text>
    </Text>
  );
};
