import type { NextPage, GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";

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
      <div className="flex flex-grow items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="w-full sm:mx-auto sm:max-w-md">
          <h1 className="mb-4 text-center text-4xl font-medium">BangerAlert</h1>
          <div className="border-2 bg-dark-containers px-4 py-6 shadow dark:border-gray-800 sm:rounded-lg sm:border-r sm:border-l sm:px-10">
            {isError && (
              <div className="relative mb-4 rounded bg-red-600 bg-opacity-50 py-3 px-3">
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
                <p className="mt-1 w-min rounded bg-gray-800 px-2 font-mono">
                  {error}
                </p>
              </div>
            )}
            <p className="mb-5 text-center text-sm font-[400] text-gray-400 opacity-70">
              Sign in with
            </p>
            <div className="-mb-1 flex flex-col justify-center">
              <button
                className="relative inline-flex items-center justify-center gap-2 rounded-md border border-green-900 bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm duration-150 hover:border-green-800 hover:bg-green-700 sm:rounded-lg sm:py-6 sm:px-12 sm:text-2xl sm:font-semibold"
                onClick={() =>
                  callbackUrl
                    ? signIn("spotify", {
                        callbackUrl: decodeURIComponent(callbackUrl) || "/",
                      })
                    : signIn("spotify")
                }
              >
                <FaSpotify />
                Spotify
              </button>
              <div className="mt-4">
                <p className="prose-sm prose text-xs text-gray-500">
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
