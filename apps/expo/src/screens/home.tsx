import React from "react";
import {
  View,
  Image,
  Pressable,
  Linking,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

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
    <SafeAreaView>
      <View className="h-full w-full px-2 py-3">
        <FlashList
          estimatedItemSize={30}
          data={feed}
          ItemSeparatorComponent={() => <View className="h-8" />}
          renderItem={({ item: song }) => (
            <View className="mx-auto w-full flex-row gap-4 rounded-lg bg-dark-containers px-2 py-3">
              <Pressable onPress={() => Linking.openURL(song.external_url)}>
                <Image
                  source={{ uri: song.album[0]?.cover_url! }}
                  style={{ height: 150, width: 100, borderRadius: 5 }}
                />
              </Pressable>
              <View>
                {song.name.length > 20 ? (
                  <>
                    <Text className="text-md text-white" numberOfLines={1}>
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
          )}
          keyExtractor={(item) => item.id}
          className="h-full"
          onRefresh={() => void utils.feed.getFeed.invalidate()}
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
      </View>
    </SafeAreaView>
  );
};
