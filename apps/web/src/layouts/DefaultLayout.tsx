import * as React from "react";

import { AppLayout } from "./AppLayout";

import RightPanel from "../ui/panels/RightPanel";
import LeftPanel from "../ui/panels/LeftPanel";

const DefaultLayout: React.FC<{
  children: React.ReactNode;
  extraMiddleLayout?: React.ReactNode;
}> = ({ children, extraMiddleLayout }) => {
  return (
    <AppLayout
      rightPanel={<RightPanel />}
      leftPanel={<LeftPanel />}
      leftResponsivePanel={<LeftPanel small={true} />}
      extraMiddleLayout={extraMiddleLayout}
    >
      {children}
    </AppLayout>
  );
};

export default DefaultLayout;
