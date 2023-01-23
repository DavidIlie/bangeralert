import React from "react";
import { Button } from "../Button";

import { SearchBar } from "../search/SearchBar";

const MiddleHeader: React.FC = () => {
  return (
    <div className="w-full px-4">
      <SearchBar inputClassName="placeholder-gray-500 text-gray-500" />
      <div className="flex items-center justify-between mt-10">
        <h1 className="text-xl font-bold">Your Feed</h1>
        <Button>New Song</Button>
      </div>
    </div>
  );
};

export default MiddleHeader;
