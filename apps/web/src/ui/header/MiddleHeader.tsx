import * as React from "react";
import { useScreenType } from "../../hooks/useScreenType";

import { SearchBar } from "../search/SearchBar";
import RightHeader from "./RightHeader";

const MiddleHeader: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const screenType = useScreenType();

  return (
    <div className="w-full px-4">
      <div className={`${children ? "mb-10" : "mb-6"} flex gap-3`}>
        <SearchBar
          inputClassName="placeholder-gray-500 text-gray-500"
          placeholder="Search for songs, users or genres"
        />
        {screenType === "1-cols" && <RightHeader />}
      </div>
      {children}
    </div>
  );
};

export default MiddleHeader;
