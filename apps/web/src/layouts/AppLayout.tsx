import * as React from "react";

import { useScreenType } from "../hooks/useScreenType";
import { AppGrid } from "../ui/AppGrid";
import { LeftPanel, MiddlePanel, RightPanel } from "./GridPanels";

export const AppLayout: React.FC<{
  rightPanel?: React.ReactNode;
  leftPanel?: React.ReactNode;
  leftResponsivePanel?: React.ReactNode;
  children: React.ReactNode;
}> = ({
  rightPanel = <div />,
  leftResponsivePanel = <div />,
  leftPanel = <div />,
  children,
}) => {
  const screenType = useScreenType();

  let components = null;

  switch (screenType) {
    case "3-cols":
      components = (
        <>
          <LeftPanel>{leftPanel}</LeftPanel>
          <MiddlePanel>{children}</MiddlePanel>
          <RightPanel>{rightPanel}</RightPanel>
        </>
      );
      break;
    case "2-cols":
      components = (
        <>
          <LeftPanel>{leftResponsivePanel}</LeftPanel>
          <MiddlePanel>{children}</MiddlePanel>
          <RightPanel>{rightPanel}</RightPanel>
        </>
      );
      break;
    case "1-cols":
      components = (
        <>
          <LeftPanel>{leftResponsivePanel}</LeftPanel>
          <MiddlePanel>{children}</MiddlePanel>
        </>
      );
      break;
    case "fullscreen":
      components = <div>{children}</div>;
  }
  return (
    <div className="flex flex-col items-center w-full h-screen scrollbar-thin scrollbar-thumb-gray-700">
      <AppGrid>{components}</AppGrid>
    </div>
  );
};
