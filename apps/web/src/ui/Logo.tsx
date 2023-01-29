import * as React from "react";

export const LgLogo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <div className="flex items-center justify-start">
      <svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M10.0006 0H29.3993C34.9418 0 39.3999 4.52599 39.3999 10.1529V29.8471C39.3999 35.474 34.9418 40 29.3993 40H10.0006C4.45809 40 0 35.474 0 29.8471V10.1529C0 4.52599 4.45809 0 10.0006 0Z"
          fill="#EFE7DC"
        />
      </svg>
      <h1 className="ml-3 text-left text-xl font-bold text-blue-500">
        BangerAlert
      </h1>
    </div>
  );
};

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  fillCurrent?: boolean;
}

export const LogoIcon = (props: LogoIconProps) => {
  return (
    <svg
      width={16}
      height={16}
      viewBox={`0 0 16 16`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path d="M4.2,5.5C3.9,4.9,3.8,4.4,4.6,4.1C4.1,4.1,3.8,4.5,3.7,5C3.7,5.2,3.9,5.5,4.2,5.5z" />
        <path
          className={props.fillCurrent ? "fill-current" : ""}
          d="M11.9,0H4.1C1.8,0,0,1.8,0,4.1v7.9C0,14.2,1.8,16,4.1,16h7.9c2.3,0,4.1-1.8,4.1-4.1V4.1C16,1.8,14.2,0,11.9,0z"
        />
      </g>
    </svg>
  );
};
