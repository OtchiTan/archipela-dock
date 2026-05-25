import type { ReactNode } from "react";
import "./Panel.css";

export type PanelType = {
  children: ReactNode;
};

export const Panel = ({ children }: PanelType) => {
  return <div className="panel">{children}</div>;
};
