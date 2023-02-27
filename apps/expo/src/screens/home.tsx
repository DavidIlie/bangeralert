import React from "react";
import {
  FlatList,
  View,
  Image,
  Pressable,
  Linking,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { api } from "../lib/api";

export const HomeScreen = () => {
  const utils = api.useContext();
  const { data, fetchNextPage, isLoading } = api.feed.getFeed.useInfiniteQuery(
    {
      limit: 30,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const feed = data?.pages.flatMap((page) => page.items.map((song) => song));

  return (
    <FlatList
      data={feed}
      renderItem={({ item: song }) => (
        <SafeAreaView className="mx-auto mb-8 w-full flex-row gap-4 rounded-lg bg-dark-containers px-2 py-3">
          <Pressable onPress={() => Linking.openURL(song.external_url)}>
            <Image
              source={{ uri: song.album[0]?.cover_url! }}
              style={{ height: 150, width: 150, borderRadius: 5 }}
            />
          </Pressable>
          <View>
            <View>
              {song.name.length > 20 ? (
                <>
                  <Text className="text-md truncate text-white">
                    {song.name}
                  </Text>
                  <View className="flex items-center gap-0.5">
                    <View className="flex">
                      <Text className="font-xs text-gray-300">
                        {song.album[0]?.name}
                      </Text>
                      <View className="mx-0.5" />
                      <Text className="font-xs text-gray-300">
                        {song.artist[0]?.name}
                      </Text>
                    </View>
                    {song.explicit && (
                      <MaterialIcons
                        name="explicit"
                        size={24}
                        color="#d1d5db"
                        className="mt-[0.05rem]"
                      />
                    )}
                  </View>
                </>
              ) : (
                <Text className="text-white">Hey</Text>
              )}
            </View>
          </View>
        </SafeAreaView>
      )}
      keyExtractor={(item) => item.id}
      className="h-full"
      onRefresh={() => {
        utils.feed.getFeed.invalidate();
      }}
      refreshing={isLoading}
      onEndReached={() => {
        if (!isLoading && feed?.length !== 0) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => {
        if (isLoading) {
          return (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="large" />
            </View>
          );
        }
        return null;
      }}
    />
  );
};
