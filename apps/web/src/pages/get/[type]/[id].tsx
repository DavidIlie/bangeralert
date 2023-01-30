import type { NextPage, GetServerSideProps } from "next";

import { prisma } from "@acme/db";

const FromSpotIdPage: NextPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-5xl font-medium">Error</h1>
    </div>
  );
};

const fetchArray = ["song", "album", "artist"];

const redirectText = {
  redirect: {
    destination: "/app",
    permanent: false,
  },
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { type, id } = query;
    if (typeof type !== "string") return redirectText;
    if (typeof id !== "string") return redirectText;

    if (!fetchArray.includes(type)) return redirectText;

    const index = fetchArray.indexOf(type);

    const possibleItem = await (prisma as any)[
      fetchArray[index] as any
    ].findFirst({
      where: { spotify_id: id },
    });

    if (!possibleItem) return redirectText;

    return {
      redirect: {
        destination: `/${fetchArray[index]}/${possibleItem.id}`,
        permanent: false,
      },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default FromSpotIdPage;
