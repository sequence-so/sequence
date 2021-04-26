import React from "react";
import SidebarItem from "./SidebarItem";
import styles from "../styles/Home.module.css";
import Logo from "../public/main_logo.svg";
import classNames from "classnames";

interface SidebarProps {
  index: number;
  items: { section: string; icon: JSX.Element }[];
  onClick: (index: number) => void;
}

const Sidebar = (props: SidebarProps) => {
  return (
    <div className={classNames(styles.sidebar, styles.dashboard_sidebar)}>
      <img className={styles.sidebar_logo} src={Logo} />
      {props.items.map(({ section, icon }, idx) => {
        return (
          <SidebarItem
            key={section}
            active={idx === props.index}
            name={section}
            icon={icon}
            onClick={() => {
              props.onClick(idx);
            }}
          />
        );
      })}
    </div>
  );
};

export default Sidebar;
