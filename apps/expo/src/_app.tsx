import React from "react";
import { StatusBar } from "expo-status-bar";
import { SessionProvider, useSession } from "next-auth/expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "./screens/home";

import { getBaseUrl, TRPCProvider } from "./lib/api";
import { appTheme } from "./lib/theme";

const Stack = createNativeStackNavigator();

const InnerApp = () => {
  const { status } = useSession();

  return (
    <TRPCProvider>
      <SafeAreaProvider className="bg-dark-bg">
        <NavigationContainer theme={appTheme}>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar />
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

export const App = () => {
  return (
    <SessionProvider baseUrl={getBaseUrl()}>
      <InnerApp />
    </SessionProvider>
  );
};
