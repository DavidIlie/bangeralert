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

export const MiddlePanel: React.FC<{
  children: React.ReactNode;
  extra?: React.ReactNode;
}> = ({ children, extra }) => {
  return (
    <div>
      <div className="sticky top-0 z-10 flex flex-1 flex-col bg-dark-bg py-4 pt-10">
        <MiddleHeader>{extra}</MiddleHeader>
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
      <div className="mt-5">{children}</div>
    </FixedGridPanel>
  );
};
