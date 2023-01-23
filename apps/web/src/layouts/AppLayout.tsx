import * as React from "react";

import { useScreenType } from "../hooks/useScreenType";
import { AppGrid } from "../ui/AppGrid";
import { OverallResponsiveHeader } from "../ui/header/OverallResponsiveHeader";
import { LeftPanel, MiddlePanel, RightPanel } from "./GridPanels";

export const AppLayout: React.FC<{
  rightPanel?: React.ReactNode;
  leftPanel?: React.ReactNode;
  leftResponsivePanel?: React.ReactNode;
  children: React.ReactNode;
  extraMiddleLayout?: React.ReactNode;
}> = ({
  rightPanel = <div />,
  leftResponsivePanel = <div />,
  leftPanel = <div />,
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
        <div className="w-full px-4 mt-4">
          <OverallResponsiveHeader />
          {children}
        </div>
      );
  }
  return (
    <div className="flex flex-col items-center w-full h-screen scrollbar-thin scrollbar-thumb-gray-700">
      <AppGrid>{components}</AppGrid>
    </div>
  );
};
