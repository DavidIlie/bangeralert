import React from "react";
import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SessionProvider, useSession } from "next-auth/expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "./screens/home";
import { SignInScreen } from "./screens/signin";

import { getBaseUrl, TRPCProvider } from "./lib/api";
import { appTheme } from "./lib/theme";

const Stack = createNativeStackNavigator();

const InnerApp = () => {
  const { status } = useSession();

  if (status === "loading")
    return (
      <SafeAreaProvider className="flex items-center justify-center bg-dark-bg">
        <Text className="text-2xl font-bold text-white">BangerAlert</Text>
        <Text className="text-sm text-white">Loading...</Text>
      </SafeAreaProvider>
    );

  return (
    <SafeAreaProvider className="bg-dark-bg">
      <NavigationContainer theme={appTheme}>
        <Stack.Navigator>
          {status === "unauthenticated" ? (
            <Stack.Screen name="Sign In" component={SignInScreen} />
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar />
    </SafeAreaProvider>
  );
};

export const App = () => {
  return (
    <SessionProvider baseUrl={getBaseUrl()}>
      <TRPCProvider>
        <InnerApp />
      </TRPCProvider>
    </SessionProvider>
  );
};
