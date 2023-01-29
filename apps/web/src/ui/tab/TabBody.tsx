import * as React from "react";

import { defaultDivProps } from "../defaultProps";

const TabBody: React.FC<
  defaultDivProps & {
    children: React.ReactNode | React.ReactNode[];
    current: number;
  }
> = ({ children, current, ...rest }) => {
  let length = (children as any).length as number;
  if (length < current)
    throw new Error("error rendering since there are not enough children");
  return <div {...rest}>{(children as any[])[current - 1]}</div>;
};

export default TabBody;
