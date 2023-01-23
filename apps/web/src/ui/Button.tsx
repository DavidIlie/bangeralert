import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from "react";
import { Spinner } from "./Spinner";

const colorClassnames = {
  primary:
    "rounded py-2 px-4 bg-blue-500 transition duration-150 ease-in-out hover:bg-blue-600 disabled:bg-blue-200 text-white",
  secondary:
    "rounded py-2 px-4 bg-red-500 transition duration-150 ease-in-out hover:bg-red-600 disabled:bg-red-200 text-white",
  transparent:
    "rounded py-1.5 px-3 border-2 border-blue-500 hover:bg-blue-600 hover:text-white transition duration-150 ease-in-out text-black",
  cyan: "rounded py-2 px-4 bg-cyan-500 transition duration-150 ease-in-out hover:bg-cyan-600 disabled:bg-cyan-200 text-white",
  sky: "rounded py-2 px-4 bg-sky-500 transition duration-150 ease-in-out hover:bg-sky-600 disabled:bg-sky-200 text-white",
  gray: "rounded py-1.5 px-3 border-2 bg-gray-100 border-gray-300 hover:bg-gray-500 hover:border-gray-600 hover:text-white transition duration-150 ease-in-out text-black",
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
      className={`flex outline-none focus:ring-2 focus:ring-${color} ${colorClassnames[color]} flex items-center justify-center font-semibold disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      <span className={loading ? "opacity-0" : `flex items-center`}>
        {icon ? <span className="items-center mr-2">{icon}</span> : null}
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
