import React from "react";

export const GridPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="flex flex-col flex-1 w-full">{children}</div>;
};

export const FixedGridPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="sticky top-0 flex flex-col flex-1 h-screen pt-12">
      {children}
    </div>
  );
};
