import { registerRootComponent } from "expo";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { transformer, trpc } from "./lib/trpc";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SessionProvider, useSession } from "next-auth/expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { serverUrl } from "./lib/constants";

import Login from "./views/login";
import Feed from "./views/feed";
import Loader from "./views/loader";

const Stack = createNativeStackNavigator();

const InnerApp = () => {
   const [queryClient] = useState(() => new QueryClient());
   const [trpcClient] = useState(() =>
      trpc.createClient({
         url: `${serverUrl}/api/trpc`,
         async headers() {
            return {};
         },
         transformer,
      })
   );

   const { status } = useSession();

   return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
         <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
               <NavigationContainer>
                  <Stack.Navigator>
                     {status !== "authenticated" ? (
                        <Stack.Group screenOptions={{ headerShown: false }}>
                           {status === "loading" ? (
                              <Stack.Screen name="Loading" component={Loader} />
                           ) : (
                              status === "unauthenticated" && (
                                 <Stack.Screen name="Login" component={Login} />
                              )
                           )}
                        </Stack.Group>
                     ) : (
                        <>
                           <Stack.Screen name="Feed" component={Feed} />
                        </>
                     )}
                  </Stack.Navigator>
               </NavigationContainer>
               <StatusBar />
            </SafeAreaProvider>
         </QueryClientProvider>
      </trpc.Provider>
   );
};

const App = () => {
   return (
      <SessionProvider baseUrl={serverUrl}>
         <InnerApp />
      </SessionProvider>
   );
};

registerRootComponent(App);
