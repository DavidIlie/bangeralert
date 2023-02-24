import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SessionProvider, useSession } from "next-auth/expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { HomeScreen } from "./screens/home";
import { SignInScreen } from "./screens/signin";

import { TRPCProvider } from "./lib/api";
import { appTheme } from "./lib/theme";

import CustomDrawer from "./ui/CustomDrawer";
import { Feather } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

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
        {status === "unauthenticated" ? (
          <Stack.Navigator>
            <Stack.Screen name="Sign In" component={SignInScreen} />
          </Stack.Navigator>
        ) : (
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
              headerRight: () => (
                <TouchableOpacity>
                  <Feather
                    name="plus"
                    size={24}
                    color="#007afd"
                    style={{ marginRight: "8%" }}
                  />
                </TouchableOpacity>
              ),
            }}
          >
            <Drawer.Screen
              name="Feed"
              options={{
                drawerLabel: "Home",
              }}
              component={HomeScreen}
            />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
      <StatusBar />
    </SafeAreaProvider>
  );
};

export const App = () => {
  return (
    <SessionProvider>
      <TRPCProvider>
        <InnerApp />
      </TRPCProvider>
    </SessionProvider>
  );
};
