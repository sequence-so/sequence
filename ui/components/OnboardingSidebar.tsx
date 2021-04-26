import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faBell,
  faSitemap,
  faEnvelope,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";

const iconStyle: React.CSSProperties = {
  width: 15,
};

const ITEMS = [
  {
    section: "Welcome",
    icon: <FontAwesomeIcon icon={faStar} style={iconStyle} />,
  },
  {
    section: "Integrations",
    icon: <FontAwesomeIcon icon={faSitemap} style={iconStyle} />,
  },
  {
    section: "Create an Alert",
    icon: <FontAwesomeIcon icon={faBell} style={iconStyle} />,
  },
  {
    section: "Configure the Message",
    icon: <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />,
  },
  {
    section: "Done",
    icon: <FontAwesomeIcon icon={faCheck} style={iconStyle} />,
  },
];

const OnboardingSiebar = ({ index }: { index: number }) => (
  <Sidebar items={ITEMS} index={index} />
);

export default OnboardingSiebar;
