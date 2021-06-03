import classNames from "classnames";
import React from "react";
import styles from "../styles/Home.module.css";

interface Props {
  active: boolean;
  name: string;
  icon: JSX.Element;
  renderIcon?: (active: boolean, icon: JSX.Element) => JSX.Element;
  onClick: () => void;
  style?: React.CSSProperties;
  isSidebarOpen: boolean;
  selectedIconStyle?: React.CSSProperties;
}

const SidebarItem = ({
  active,
  name,
  icon,
  onClick,
  style,
  isSidebarOpen,
  renderIcon,
}: Props) => {
  return (
    <div
      className={classNames(
        styles.sidebar_link,
        active ? styles.sidebar_link_active : ""
      )}
      onClick={onClick}
      style={style}
    >
      {active && <div className={styles.sidebar_link_box}></div>}
      <div className={styles.sidebar_icon}>
        {renderIcon ? renderIcon(active, icon) : icon}
      </div>
      {isSidebarOpen && <span>{name}</span>}
    </div>
  );
};

export default SidebarItem;
