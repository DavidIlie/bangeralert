import * as React from "react";
import { Tooltip } from "@mantine/core";
import { IconType } from "react-icons";

const BaseTag: React.FC<{
  label: string;
  Icon: IconType;
}> = ({ label, Icon }) => {
  return (
    <Tooltip label={label} position="bottom">
      <div>
        <Icon size="20" className="cursor-pointer" />
      </div>
    </Tooltip>
  );
};

export default BaseTag;
