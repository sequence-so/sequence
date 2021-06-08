import React from "react";
import Sidebar from "./Sidebar2";
import { SIDEBAR_LIST } from "constants/page";
export interface SidebarItemProp {
  section: string;
  icon: JSX.Element | null;
  route: string;
  style?: React.CSSProperties;
  renderIcon?: (active: boolean) => JSX.Element;
}

interface Props {
  index: number;
  onClick: ({ index: number, route: string }) => void;
}

const DashboardSidebar = (props: Props) => (
  <Sidebar
    items={SIDEBAR_LIST}
    index={props.index}
    onClick={(index: number) => {
      const route = SIDEBAR_LIST[index].route;
      props.onClick({ index, route });
    }}
  />
);

export default DashboardSidebar;
