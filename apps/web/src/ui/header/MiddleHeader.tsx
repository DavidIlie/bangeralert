import React from "react";

import { SearchBar } from "../search/SearchBar";

const MiddleHeader: React.FC = () => {
  return (
    <div className="flex w-full gap-1 px-4">
      <SearchBar inputClassName="placeholder-gray-500 text-gray-500" />
    </div>
  );
};

export default MiddleHeader;
