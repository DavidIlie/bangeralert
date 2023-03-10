import React from "react";
import { useScreenType } from "../../hooks/useScreenType";
import { SearchBar } from "../search/SearchBar";

import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";

export const OverallResponsiveHeader: React.FC = () => {
  const screenType = useScreenType();
  return (
    <div className="flex justify-center flex-1 w-full mb-4">
      {screenType === "fullscreen" ? (
        <div className="flex mr-4">
          <LeftHeader />
        </div>
      ) : null}
      <SearchBar
        inputClassName="placeholder-gray-500 text-gray-500"
        placeholder="Search for songs, users or genres"
      />
      {screenType === "1-cols" || screenType === "fullscreen" ? (
        <div className="flex ml-4 w-14">
          <RightHeader />
        </div>
      ) : null}
    </div>
  );
};
