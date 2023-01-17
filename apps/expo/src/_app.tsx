import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "next-auth/expo";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getBaseUrl, TRPCProvider } from "./lib/api";

import { HomeScreen } from "./screens/home";

export const App = () => {
  return (
    <SessionProvider baseUrl={getBaseUrl()}>
      <TRPCProvider>
        <SafeAreaProvider>
          <HomeScreen />
          <StatusBar />
        </SafeAreaProvider>
      </TRPCProvider>
    </SessionProvider>
  );
};
