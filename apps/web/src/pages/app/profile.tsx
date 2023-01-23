import type { NextPage } from "next";
import { NextSeo } from "next-seo";

import DefaultLayout from "../../layouts/DefaultLayout";

const Profile: NextPage = () => {
  return (
    <>
      <NextSeo title="Profile" />
      <DefaultLayout>
        <h1>hey</h1>
      </DefaultLayout>
    </>
  );
};

export default Profile;
