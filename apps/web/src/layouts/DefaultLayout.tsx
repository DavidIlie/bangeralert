import * as React from "react";

import { AppLayout } from "./AppLayout";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AppLayout
      rightPanel={<RightPanel />}
      leftPanel={<LeftPanel />}
      leftResponsivePanel={<LeftResponsivePanel />}
    >
      {children}
    </AppLayout>
  );
};

const RightPanel: React.FC = () => {
  return (
    <div>
      <h1>hey right panel</h1>
    </div>
  );
};

const LeftPanel: React.FC = () => {
  return (
    <div>
      <h1>hey left panel</h1>
    </div>
  );
};
const LeftResponsivePanel: React.FC = () => {
  return (
    <div>
      <h1>hey left</h1>
    </div>
  );
};

export default DefaultLayout;
