import * as React from "react";
import { FixedGridPanel } from "../ui/GridPanel";
import LeftHeader from "../ui/header/LeftHeader";
import MiddleHeader from "../ui/header/MiddleHeader";
import RightHeader from "../ui/header/RightHeader";

interface BaseProps {
  children: React.ReactNode;
}

const HeaderWrapper: React.FC<BaseProps> = ({ children }) => (
  <div className={`mb-7 flex h-6 items-center`}>{children}</div>
);

export const LeftPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <FixedGridPanel>
      <HeaderWrapper>
        <LeftHeader />
      </HeaderWrapper>
      <div className="mt-6">{children}</div>
    </FixedGridPanel>
  );
};

export const MiddlePanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <div className="sticky top-0 flex flex-col flex-1 py-4 pt-10 bg-dark-bg">
        <MiddleHeader />
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
};

export const RightPanel: React.FC<BaseProps> = ({ children }) => {
  return (
    <FixedGridPanel>
      <HeaderWrapper>
        <RightHeader />
      </HeaderWrapper>
      <div className="mt-6">{children}</div>
    </FixedGridPanel>
  );
};
