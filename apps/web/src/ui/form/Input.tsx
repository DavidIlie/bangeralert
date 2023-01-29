import React, { InputHTMLAttributes, DetailedHTMLProps } from "react";

interface InputProps {
  input?: string;
  required?: boolean;
  className?: string;
  color?: string;
  border?: string;
  type?: string;
}

type Types = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  InputProps;

const Input: React.FC<Types> = ({
  input,
  required,
  className,
  color = "dark-containers",
  border = "gray-900",
  ...rest
}): JSX.Element => {
  return (
    <input
      className={`${className} w-full rounded-lg border py-2 px-3 bg-${color} border-${border} text-gray-100 focus:border-gray-800 focus:outline-none focus:ring-opacity-50`}
      required={required}
      {...rest}
    />
  );
};

export default Input;
