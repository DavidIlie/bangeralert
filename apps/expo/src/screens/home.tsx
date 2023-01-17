import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth";
import { signIn, useSession, signOut } from "next-auth/expo";

export const HomeScreen = () => {
  const spotifyLogin = useAuth("spotify");
  const { status, data } = useSession();

  return (
    <SafeAreaView className="bg-dark-bg">
      <View className="h-full w-full p-4">
        {status === "unauthenticated" ? (
          <Pressable
            className="mx-auto mt-2 rounded-md bg-blue-500 py-2 px-4 hover:bg-blue-600"
            onPress={() => signIn(spotifyLogin)}
          >
            <Text className="font-medium text-white">Log In</Text>
          </Pressable>
        ) : status === "authenticated" ? (
          <Text className="text-white">
            Logged in as {data?.user?.name},{" "}
            <Text onPress={() => signOut()} className="font-medium">
              Sign Out
            </Text>
          </Text>
        ) : (
          <Text className="text-white">Loading Authentication...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};
