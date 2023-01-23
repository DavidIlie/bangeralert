import Link from "next/link";
import React from "react";
import { LgLogo, LogoIcon } from "../Logo";
import { useScreenType } from "../../hooks/useScreenType";

export interface LeftHeaderProps {}

const LeftHeader: React.FC<LeftHeaderProps> = ({}) => {
  const screenType = useScreenType();
  return (
    <Link href="/app">
      <div className=" w-full">
        {screenType === "3-cols" ? (
          <LgLogo />
        ) : (
          <div className="flex w-full justify-center">
            <LogoIcon width={40} height={40} color="#EFE7DC" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default LeftHeader;
