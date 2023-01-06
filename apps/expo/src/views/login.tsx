import { Text, View, Pressable } from "react-native";
import { signIn } from "next-auth/expo";

import { useAuth } from "../lib/auth";

const Login = () => {
   const spotifyLogin = useAuth("spotify");

   return (
      <View className="flex justify-center items-center h-full">
         <Pressable
            className="mx-auto mt-2 bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md"
            onPress={() => signIn(spotifyLogin)}
         >
            <Text className="text-white font-medium">Log In</Text>
         </Pressable>
      </View>
   );
};

export default Login;
