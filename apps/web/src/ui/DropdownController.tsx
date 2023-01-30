import React, { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import { Portal } from "@mantine/core";

export const DropdownController: React.FC<{
  children: React.ReactNode;
  portal?: boolean;
  className?: string;
  innerClassName?: string;
  overlay: (c: () => void) => React.ReactNode;
  zIndex?: number;
}> = ({
  children,
  className,
  innerClassName,
  overlay,
  portal = true,
  zIndex,
}) => {
  const [visible, setVisibility] = useState(false);

  const referenceRef = useRef<HTMLButtonElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const { styles, attributes } = usePopper(
    referenceRef.current,
    popperRef.current,
    {
      modifiers: [{ name: "eventListeners", enabled: visible }],
      placement: "left",
    },
  );

  useEffect(() => {
    const handleDocumentClick = (event: any) => {
      if (
        referenceRef.current?.contains(event.target) ||
        popperRef.current?.contains(event.target)
      ) {
        return;
      }
      setVisibility(false);
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const body = (
    <div
      className={`absolute ${className}`}
      ref={popperRef}
      {...attributes.popper}
      style={{ zIndex: zIndex || 5 }}
    >
      <div
        style={styles.offset}
        className={`${visible ? "" : "hidden"} ${innerClassName}`}
      >
        {visible ? overlay(() => setVisibility(false)) : null}
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <button
        className="focus:outline-no-chrome"
        ref={referenceRef}
        onClick={() => setVisibility(!visible)}
      >
        {children}
      </button>
      {portal ? <Portal target="#__next">{body}</Portal> : body}
    </React.Fragment>
  );
};
