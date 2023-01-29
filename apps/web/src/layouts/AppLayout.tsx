import * as React from "react";

import { useScreenType } from "../hooks/useScreenType";
import { AppGrid } from "../ui/AppGrid";
import { OverallResponsiveHeader } from "../ui/header/OverallResponsiveHeader";
import { LeftPanel, MiddlePanel, RightPanel } from "./GridPanels";

import MainRightPanel from "../ui/panels/RightPanel";
import MainleftPanel from "../ui/panels/LeftPanel";

export const AppLayout: React.FC<{
  rightPanel?: React.ReactNode;
  leftPanel?: React.ReactNode;
  leftResponsivePanel?: React.ReactNode;
  children: React.ReactNode;
  extraMiddleLayout?: React.ReactNode | React.ReactNode[];
}> = ({
  rightPanel = <MainRightPanel />,
  leftResponsivePanel = <MainleftPanel small={true} />,
  leftPanel = <MainleftPanel />,
  extraMiddleLayout,
  children,
}) => {
  const screenType = useScreenType();

  let components = null;

  switch (screenType) {
    case "3-cols":
      components = (
        <>
          <LeftPanel>{leftPanel}</LeftPanel>
          <MiddlePanel extra={extraMiddleLayout}>{children}</MiddlePanel>
          <RightPanel>{rightPanel}</RightPanel>
        </>
      );
      break;
    case "2-cols":
      components = (
        <>
          <LeftPanel>{leftResponsivePanel}</LeftPanel>
          <MiddlePanel extra={extraMiddleLayout}>{children}</MiddlePanel>
          <RightPanel>{rightPanel}</RightPanel>
        </>
      );
      break;
    case "1-cols":
      components = (
        <>
          <LeftPanel>{leftResponsivePanel}</LeftPanel>
          <MiddlePanel extra={extraMiddleLayout}>{children}</MiddlePanel>
        </>
      );
      break;
    case "fullscreen":
      components = (
        <div className="mt-4 w-full px-4">
          <OverallResponsiveHeader />
          {children}
        </div>
      );
  }
  return (
    <div className="flex h-screen w-full flex-col items-center scrollbar-thin scrollbar-thumb-gray-700">
      <AppGrid>{components}</AppGrid>
    </div>
  );
};
