import * as React from "react";

import { defaultDivProps } from "../defaultProps";

const LeftPanel: React.FC<{ small?: boolean }> = () => {
  return (
    <div>
      <PanelTitle>USER SETTINGS</PanelTitle>
      <PanelElement selected>Profile</PanelElement>
      <PanelElement>Account</PanelElement>
      <PanelElement>Security & Privacy</PanelElement>
      <PanelBorder />
      <PanelTitle>APP SETTINGS</PanelTitle>
      <PanelElement>Appearance</PanelElement>
      <PanelElement>Song Feed</PanelElement>
      <PanelBorder />
      <PanelElement>Changelog</PanelElement>
    </div>
  );
};

const PanelElement: React.FC<defaultDivProps & { selected?: boolean }> = ({
  children,
  selected = false,
  ...rest
}) => {
  const styles = selected
    ? "bg-dark-containers bg-opacity-50"
    : "px-4 hover:bg-dark-containers hover:bg-opacity-40 duration-150 cursor-pointer";
  return (
    <div
      {...rest}
      className={`${styles} mb-1 rounded-lg px-3 py-1 text-gray-200`}
    >
      {children}
    </div>
  );
};

const PanelTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1 className="mb-1 text-gray-500">{children}</h1>
);

const PanelBorder: React.FC = () => (
  <div className="my-2 border border-gray-500 px-3" />
);

export default LeftPanel;
