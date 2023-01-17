import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  const { data, status } = useSession();
  return (
    <>
      {status === "unauthenticated" ? (
        <button onClick={() => signIn("spotify")}>sign in</button>
      ) : status === "authenticated" ? (
        <>
          <p>Signed in as: {data?.user?.name}</p>
          <button onClick={() => signOut()}>sign out</button>
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default Home;
