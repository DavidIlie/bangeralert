import * as React from "react";
import { useEffect } from "react";

import { defaultDivProps } from "../defaultProps";

const TabOption: React.FC<
  defaultDivProps & {
    self: number;
    current: number;
    updateTab: (s: number) => void;
    disabled?: boolean;
  }
> = ({
  children,
  self,
  current,
  updateTab,
  disabled = false,
  onClick,
  ...rest
}) => {
  const classSelected =
    self === current
      ? "bg-opacity-50"
      : "hover:bg-opacity-50 duration-150 cursor-pointer";
  const disabledClass =
    disabled &&
    "bg-dark-containers bg-opacity-10 cursor-not-allowed hover:bg-opacity-10";

  useEffect(() => {
    if (self === current && disabled) updateTab(1);
  }, [disabled, current, self, updateTab]);

  return (
    <div
      {...rest}
      className={`${classSelected} ${disabledClass} w-full rounded-t-lg bg-dark-containers py-3 text-center`}
      onClick={(e) => {
        if (disabled) return;
        if (self !== current) updateTab(self);
        if (onClick) onClick(e);
      }}
    >
      {children}
    </div>
  );
};

export default TabOption;
