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
        <div className="rounded-lg bg-dark-containers px-6 py-4">
          <h1 className="text-2xl font-medium">Public Profile</h1>
        </div>
      </AppLayout>
    </>
  );
};

export default Profile;
