import * as React from "react";

import { AppLayout } from "./AppLayout";

import RightPanel from "../ui/panels/RightPanel";
import LeftPanel from "../ui/panels/LeftPanel";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AppLayout
      rightPanel={<RightPanel />}
      leftPanel={<LeftPanel />}
      leftResponsivePanel={<LeftPanel small={true} />}
    >
      {children}
    </AppLayout>
  );
};

export default DefaultLayout;
