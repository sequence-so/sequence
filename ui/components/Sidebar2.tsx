import React from "react";
import SidebarItem from "./SidebarItem";
import styles from "../styles/Home.module.css";
import Logo from "../public/main_logo.svg";
import LogoSquare from "../public/logo_square.svg";
import classNames from "classnames";
import { SidebarItemProp } from "./DashboardSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useGlobalState } from "../layout/DashboardLayout";

interface SidebarProps {
  index: number;
  items: SidebarItemProp[];
  onClick: (index: number) => void;
}

const Sidebar = (props: SidebarProps) => {
  const [isSidebarOpen, setSidebarOpen] = useGlobalState("isSidebarOpen");

  return (
    <div
      className={classNames(
        styles.sidebar,
        styles.dashboard_sidebar,
        !isSidebarOpen ? styles.collapsed_sidebar : ""
      )}
    >
      <img
        className={styles.sidebar_logo}
        src={Logo}
        style={{ display: isSidebarOpen ? "initial" : "none" }}
      />
      <img
        src={LogoSquare}
        style={{
          display: !isSidebarOpen ? "initial" : "none",
          height: 28,
          marginTop: 47,
          marginBottom: 29,
          marginLeft: 4,
        }}
      />
      {props.items.map(({ section, icon, style }, idx) => {
        return (
          <SidebarItem
            key={section}
            active={idx === props.index}
            name={section}
            icon={icon}
            onClick={() => {
              props.onClick(idx);
            }}
            style={style}
            isSidebarOpen={isSidebarOpen}
          />
        );
      })}
      <div
        className={styles.sidebar_collapse}
        style={{
          marginTop: "auto",
          justifySelf: "flex-end",
        }}
        onClick={(): void => {
          setSidebarOpen(!isSidebarOpen);
        }}
      >
        <FontAwesomeIcon
          icon={isSidebarOpen ? faArrowLeft : faArrowRight}
          style={{ marginLeft: "auto", marginRight: 4 }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
