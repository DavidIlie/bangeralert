import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from "react";

import { Spinner } from "./Spinner";

const colorClassnames = {
  primary:
    "rounded py-2 px-4 transition duration-150 ease-in-out bg-blue-800 hover:bg-blue-900 disabled:bg-blue-900 disabled:bg-opacity-30 disabled:hover:bg-opacity-50 disabled:bg-dark-containers border-blue-500 border border-blue-800 hover:border-blue-900 border-blue-500 disabled:border-none",
  secondary:
    "rounded py-2 px-4 transition duration-150 ease-in-out bg-red-800 hover:bg-red-900 disabled:bg-dark-containers disabled:border border-red-500 border border-red-800 hover:border-red-900 border-red-500 disabled:border-red-200",
  transparent:
    "rounded py-1.5 px-3 border-2 hover:bg-blue-600 hover:text-white transition duration-150 ease-in-out text-black",
  cyan: "rounded py-2 px-4 transition duration-150 ease-in-out bg-cyan-800 hover:bg-cyan-900 disabled:bg-dark-containers disabled:border border-gray-500 border border-cyan-800 hover:border-cyan-900 border-cyan-500 disabled:border-cyan-200",
  sky: "rounded py-2 px-4 transition duration-150 ease-in-out text-white bg-sky-800 hover:bg-sky-900 disabled:bg-dark-containers disabled:border border-sky-500 border border-sky-800 hover:border-sky-900 border-sky-500 disabled:border-sky-200",
  green:
    "rounded py-2 px-4 transition duration-150 ease-in-out hover:bg-green-600 disabled:bg-green-200 text-white text-white bg-green-800 hover:bg-green-900 disabled:bg-dark-containers disabled:border border-green-500 border border-green-800 hover:border-green-900 border-green-500 disabled:border-green-200",
};

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  color?: keyof typeof colorClassnames;
  loading?: boolean;
  icon?: ReactNode;
  transition?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  color = "primary",
  disabled,
  loading,
  icon,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`flex outline-none focus:ring-4 focus:ring-${color} ${colorClassnames[color]} flex items-center justify-center font-semibold disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      <span className={loading ? "opacity-0" : `flex items-center`}>
        {icon ? <span className="mr-2 items-center">{icon}</span> : null}
        {children}
      </span>
      {loading && (
        <span className={`absolute flex items-center gap-2`}>
          Loading <Spinner size="4" />
        </span>
      )}
    </button>
  );
};
