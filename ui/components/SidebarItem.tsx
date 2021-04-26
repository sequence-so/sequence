import classNames from "classnames";
import styles from "../styles/Home.module.css";

interface Props {
  active: boolean;
  name: string;
  icon: JSX.Element;
  onClick: () => void;
}

const SidebarItem = ({ active, name, icon, onClick }: Props) => {
  return (
    <div
      className={classNames(
        styles.sidebar_link,
        active ? styles.sidebar_link_active : ""
      )}
      onClick={onClick}
    >
      {active && <div className={styles.sidebar_link_box}></div>}
      <div>{icon}</div>
      <span>{name}</span>
    </div>
  );
};

export default SidebarItem;
