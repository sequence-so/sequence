import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faEnvelope,
  faUserFriends,
  faSearch,
  faCommentAlt,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar2";

const iconStyle: React.CSSProperties = {
  width: 15,
};

export interface SidebarItemProp {
  section: string;
  icon: JSX.Element | null;
  route: string;
  style?: React.CSSProperties;
  renderIcon?: (active: boolean) => JSX.Element;
}

const ITEMS = [
  {
    section: "Blasts",
    icon: <FontAwesomeIcon icon={faCommentAlt} style={iconStyle} />,
    route: "/blasts",
  },
  {
    section: "Audiences",
    icon: <FontAwesomeIcon icon={faUserFriends} style={iconStyle} />,
    route: "/audiences",
  },
  {
    section: "Emails",
    icon: <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />,
    route: "/emails",
  },
  {
    section: "Person Explorer",
    icon: <FontAwesomeIcon icon={faSearch} style={iconStyle} />,
    route: "/explorer",
  },
];

interface Props {
  index: number;
  onClick: ({ index: number, route: string }) => void;
}

const DashboardSidebar = (props: Props) => (
  <Sidebar
    items={ITEMS}
    index={props.index}
    onClick={(index: number) => {
      const route = ITEMS[index].route;
      props.onClick({ index, route });
    }}
  />
);

export default DashboardSidebar;
