import type { NextPage } from "next";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
   const { data } = useSession();
   return <div>{data?.user?.name}</div>;
};

export default Home;
