import React from "react";
import SidebarItem from "./SidebarItem";
import styles from "../styles/Home.module.css";
import Logo from "../public/main_logo.svg";
import classNames from "classnames";
import { SidebarItemProp } from "./DashboardSidebar";

interface SidebarProps {
  index: number;
  items: SidebarItemProp[];
  onClick: (index: number) => void;
}

const Sidebar = (props: SidebarProps) => {
  return (
    <div className={classNames(styles.sidebar, styles.dashboard_sidebar)}>
      <img className={styles.sidebar_logo} src={Logo} />
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
          />
        );
      })}
      <div style={{ marginTop: "auto", justifySelf: "flex-end" }}>Collapse</div>
    </div>
  );
};

export default Sidebar;
