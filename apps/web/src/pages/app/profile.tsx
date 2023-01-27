import type { NextPage } from "next";
import { NextSeo } from "next-seo";

import { AppLayout } from "../../layouts/AppLayout";
import LeftPanel from "../../ui/profile/LeftPanel";

const Profile: NextPage = () => {
  return (
    <>
      <NextSeo title="Profile" />
      <AppLayout
        leftPanel={<LeftPanel />}
        leftResponsivePanel={<LeftPanel small={true} />}
      >
        <h1>hey</h1>
      </AppLayout>
    </>
  );
};

export default Profile;
