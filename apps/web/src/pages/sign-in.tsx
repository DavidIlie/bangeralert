import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import { signIn } from "next-auth/react";
import { FaSpotify } from "react-icons/fa";

const SignIn: NextPage = () => {
   return (
      <>
         <NextSeo title="Sign In" />
         <div className="bg-gray-900 min-h-screen flex items-center justify-center ">
            <div className="border-y border-gray-700 bg-gray-800 py-6 px-4 shadow sm:rounded-lg sm:border-x sm:px-10 max-w-md">
               <h1 className="text-3xl font-medium text-gray-100 mb-4 text-center">
                  BangerAlert
               </h1>
               <button
                  className="relative inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white duration-150 bg-blue-600 border border-blue-700 rounded-md shadow-sm dark:bg-blue-600 dark:border-blue-700 dark:hover:bg-blue-700 dark:hover:border-blue-800 hover:bg-blue-700 sm:py-6 sm:px-12 sm:text-2xl sm:font-semibold sm:rounded-lg w-full"
                  onClick={() => signIn("spotify", { callbackUrl: "/app" })}
               >
                  <FaSpotify />
                  Sign in with Spotify
               </button>
               <p className="mt-4 text-xs prose-sm prose text-gray-500">
                  By logging in, you agree to our{" "}
                  <a className="text-blue-600" href="#">
                     terms of service
                  </a>{" "}
                  and{" "}
                  <a className="text-blue-600" href="#">
                     privacy policy
                  </a>
                  .
               </p>
            </div>
         </div>
      </>
   );
};

export default SignIn;
