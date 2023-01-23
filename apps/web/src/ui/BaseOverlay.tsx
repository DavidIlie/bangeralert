import React, { MouseEventHandler, ReactNode } from "react";

export interface BaseOverlayProps
  extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  actionButton?: string;
  onActionButtonClicked?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  overlay?: ReactNode;
}

export const BaseOverlay: React.FC<BaseOverlayProps> = ({
  children,
  title,
  actionButton,
  overlay,
  onActionButtonClicked,
  ...props
}) => {
  return (
    <div
      className="relative flex flex-col w-full overflow-hidden border border-gray-900 rounded-xl bg-dark-containers"
      {...props}
    >
      {overlay ? overlay : ""}
      {title && (
        <div className="flex items-center px-4 py-3 border-b border-gray-600">
          <h4 className="text-gray-100">{title}</h4>
        </div>
      )}
      <div className="flex flex-col text-gray-100">{children}</div>
      {actionButton && (
        <button
          className="flex px-4 font-bold text-gray-100 duration-150 bg-opacity-50 outline-none bg-dark-bg hover:bg-opacity-100"
          style={{
            paddingTop: 8,
            paddingBottom: 12,
            borderRadius: "0 0 8px 8px",
          }}
          onClick={onActionButtonClicked}
        >
          {actionButton}
        </button>
      )}
    </div>
  );
};
