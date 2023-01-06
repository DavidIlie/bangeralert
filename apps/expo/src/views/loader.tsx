import { View } from "react-native";

//@ts-ignore
import AnimatedEllipsis from "rn-animated-ellipsis";

const Loader = () => {
   return (
      <View className="h-screen flex justify-center items-center bg-gray-100">
         <View className="-ml-16 -mt-24">
            <AnimatedEllipsis
               numberOfDots={3}
               animationDelay={150}
               className="text-black text-[150rem] -mr-5"
            />
         </View>
      </View>
   );
};

export default Loader;
