import React from "react";
import { View, Text, Pressable } from "react-native";
import { signOut } from "next-auth/expo";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Device from "expo-device";
import Constants from "expo-constants";
import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";

import useLoggedInSession from "../hooks/useLoggedInSession";

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const { data } = useLoggedInSession();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        top: 0,
        bottom: 0,
      }}
    >
      <View className="mb-2 border-b border-gray-500 p-1.5 px-3">
        <Text className="text-lg font-bold text-white">
          Welcome {data.user.name}
        </Text>
      </View>
      <DrawerItemList {...props} />
      <SafeAreaView className="absolute bottom-0 w-full">
        <Pressable
          onPress={signOut}
          className="mx-auto w-full bg-blue-700 py-2"
        >
          <Text className="text-center text-lg font-bold text-white">
            Log Out
          </Text>
        </Pressable>
        <Text className="mx-auto mt-2 italic text-gray-400">
          Version {Constants?.manifest?.version} - {Device.osBuildId} (
          {Device.modelId})
        </Text>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
