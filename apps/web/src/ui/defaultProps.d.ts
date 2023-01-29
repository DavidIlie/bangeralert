import {
  DivHTMLAttributes,
  HTMLDivElement,
  DetailedHTMLProps,
  ReactNode,
} from "react";

export interface defaultDivProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
}
