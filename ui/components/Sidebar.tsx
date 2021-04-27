import React from "react";
import SidebarItem from "./SidebarItem";
import styles from "../styles/Home.module.css";
import Logo from "../public/main_logo.svg";

interface SidebarProps {
  index: number;
  items: { section: string; icon: JSX.Element }[];
}

const Sidebar = (props: SidebarProps) => {
  return (
    <div className={styles.sidebar}>
      <img className={styles.sidebar_logo} src={Logo} />
      {props.items.map(({ section, icon }, idx) => {
        return (
          <SidebarItem
            key={section}
            active={idx === props.index}
            name={section}
            icon={icon}
            onClick={() => {}}
            isSidebarOpen={true}
          />
        );
      })}
    </div>
  );
};

export default Sidebar;
