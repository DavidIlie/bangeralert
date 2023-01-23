import * as React from "react";

import { useScreenType } from "../hooks/useScreenType";

export const AppGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const screenType = useScreenType();

  let gridTemplateColumns = "235px 640px 325px";
  let injectClassname = ``;

  if (screenType === "2-cols") {
    gridTemplateColumns = "60px 640px 325px";
  } else if (screenType === "1-cols") {
    gridTemplateColumns = "60px 640px";
  } else if (screenType === "fullscreen") {
    injectClassname = "w-full px-3";
    gridTemplateColumns = "1fr";
  }

  return (
    <div
      className={`relative ${injectClassname} mx-auto`}
      style={{
        display: screenType === "fullscreen" ? "flex" : "grid",
        gridTemplateColumns,
        columnGap: 60,
      }}
    >
      {children}
    </div>
  );
};
