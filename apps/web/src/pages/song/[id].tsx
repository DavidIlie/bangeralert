import type { NextPage, GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { prisma } from "@acme/db";

const SongViewer: NextPage<{ song: { name: string } }> = ({
  song: serverSong,
}) => {
  return (
    <>
      <NextSeo title={serverSong.name} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  song: { name: string };
}> = async ({ query }) => {
  const { id } = query;
  if (typeof id !== "string")
    return { redirect: { destination: "/app", permanent: false } };

  const baseSong = await prisma.song.findFirst({
    where: { id },
    select: { name: true },
  });

  if (!baseSong) return { redirect: { destination: "/app", permanent: false } };
  return { props: { song: baseSong } };
};

export default SongViewer;
