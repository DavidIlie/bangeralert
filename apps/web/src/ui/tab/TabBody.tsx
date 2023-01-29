import * as React from "react";

const TabBody: React.FC<{
  children: React.ReactNode | React.ReactNode[];
  current: number;
}> = ({ children, current }) => {
  let length = (children as any).length as number;
  if (length < current)
    throw new Error("error rendering since there are not enough children");
  return <>{(children as any[])[current - 1]}</>;
};

export default TabBody;
