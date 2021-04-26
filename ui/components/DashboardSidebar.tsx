import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUsers,
  faSitemap,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar2";

const iconStyle: React.CSSProperties = {
  width: 15,
};

const ITEMS = [
  {
    section: "My Alerts",
    icon: <FontAwesomeIcon icon={faBell} style={iconStyle} />,
  },
  {
    section: "User Explorer",
    icon: <FontAwesomeIcon icon={faUsers} style={iconStyle} />,
  },
  {
    section: "Integrations",
    icon: <FontAwesomeIcon icon={faSitemap} style={iconStyle} />,
  },
  {
    section: "Settings",
    icon: <FontAwesomeIcon icon={faCog} style={iconStyle} />,
  },
];

const DashboardSidebar = ({ index }: { index: number }) => (
  <Sidebar items={ITEMS} index={index} />
);

export default DashboardSidebar;
