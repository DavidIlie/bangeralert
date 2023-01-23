import type { NextPage, GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { NextSeo } from "next-seo";

import { FaSpotify } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

import { getServerSession } from "@acme/auth/backend";

const SignIn: NextPage = () => {
  const { callbackUrl, error } = useRouter().query as {
    callbackUrl?: string;
    error?: string;
  };
  const { push } = useRouter();

  const [isError, changeErrorState] = useState(typeof error === "string");

  useEffect(() => {
    if (typeof callbackUrl === "string" && callbackUrl === "/") {
      push("/sign-in", "", { shallow: true });
    }
  }, [callbackUrl, push]);

  return (
    <>
      <NextSeo title="Sign In" />
      <div className="flex items-center justify-center flex-grow py-12 sm:px-6 lg:px-8">
        <div className="w-full sm:mx-auto sm:max-w-md">
          <h1 className="mb-4 text-4xl font-medium text-center">BangerAlert</h1>
          <div className="px-4 py-6 border-2 shadow bg-dark-containers dark:border-gray-800 sm:rounded-lg sm:border-r sm:border-l sm:px-10">
            {isError && (
              <div className="relative px-3 py-3 mb-4 bg-red-600 bg-opacity-50 rounded">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold">
                    There has been an error!
                  </h1>
                  <AiOutlineClose
                    onClick={() => {
                      changeErrorState(false);
                      if (typeof callbackUrl !== "string")
                        return push(`/sign-in`, "", { shallow: true });
                      return push(`/sign-in?callbackUrl=${callbackUrl}`, "", {
                        shallow: true,
                      });
                    }}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-sm">
                  There has been an error trying to signin to your account.
                </p>
                <p className="px-2 mt-1 font-mono bg-gray-800 rounded w-min">
                  {error}
                </p>
              </div>
            )}
            <div className="flex flex-col justify-center -mb-1">
              <button
                className="relative inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white duration-150 bg-green-600 border border-green-900 rounded-md shadow-sm hover:border-green-800 hover:bg-green-700 sm:rounded-lg sm:py-6 sm:px-12 sm:text-2xl sm:font-semibold"
                onClick={() =>
                  callbackUrl
                    ? signIn("spotify", {
                        callbackUrl: decodeURIComponent(callbackUrl) || "/",
                      })
                    : signIn("spotify")
                }
              >
                <FaSpotify />
                Sign in with Spotify
              </button>
              <div className="mt-4">
                <p className="text-xs prose-sm prose text-gray-500">
                  By signing in, you agree to the{" "}
                  <Link href="/info/terms-of-service" className="text-blue-600">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/info/privacy-policy" className="text-blue-600">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession({ req, res });

  if (session) return { redirect: { destination: "/app", permanent: false } };

  return { props: {} };
};

export default SignIn;
