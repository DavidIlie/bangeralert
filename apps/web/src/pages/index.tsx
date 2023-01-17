import type { GetServerSideProps, NextPage } from "next";

import { getServerSession } from "@acme/auth/backend";

const Page: NextPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-5xl font-medium">Error</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const session = await getServerSession({ req, res });
    if (!session)
      return {
        redirect: {
          permanent: false,
          destination: "/sign-in",
        },
      };
    return {
      redirect: {
        permanent: false,
        destination: "/app",
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

export default Page;
