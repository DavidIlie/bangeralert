import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Spinner } from "../Spinner";

export interface SearchBarProps
  extends React.ComponentPropsWithoutRef<"input"> {
  inputClassName?: string;
  mobile?: boolean;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = "",
  inputClassName = "",
  isLoading = false,
  mobile = false,
  ...props
}) => {
  return (
    <div
      className={`flex w-full items-center rounded-lg bg-dark-containers text-gray-300 transition duration-200 ease-in-out focus-within:text-gray-100 ${
        mobile ? "px-4" : ""
      } ${className}`}
    >
      {!mobile && (
        <div className="flex items-center h-full mx-4 pointer-events-none">
          <AiOutlineSearch />
        </div>
      )}
      <input
        className={`rounded-8 w-full rounded-lg bg-dark-containers py-2 px-4 text-gray-100 placeholder-gray-300 focus:outline-none ${inputClassName} pl-0`}
        {...props}
      />
      {isLoading && (
        <div
          className={`pointer-events-none flex h-full items-center ${
            !mobile && "mx-4"
          }`}
        >
          <Spinner />
        </div>
      )}
    </div>
  );
};
