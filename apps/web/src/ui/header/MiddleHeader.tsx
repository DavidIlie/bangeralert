import * as React from "react";

import { SearchBar } from "../search/SearchBar";

const MiddleHeader: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="w-full px-4">
      <SearchBar
        inputClassName="placeholder-gray-500 text-gray-500"
        placeholder="Search for songs, users or genres"
      />
      {children}
    </div>
  );
};

export default MiddleHeader;
