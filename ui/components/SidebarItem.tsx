import classNames from "classnames";
import styles from "../styles/Home.module.css";

const SidebarItem = ({
  active,
  name,
  icon,
}: {
  active: boolean;
  name: string;
  icon: JSX.Element;
}) => {
  return (
    <div
      className={classNames(
        styles.sidebar_link,
        active ? styles.sidebar_link_active : ""
      )}
    >
      <div>{icon}</div>
      <span>{name}</span>
    </div>
  );
};

export default SidebarItem;
