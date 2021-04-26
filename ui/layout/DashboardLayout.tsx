import React from "react";
import styles from "../styles/Home.module.css";
import DashboardSidebar from "../components/DashboardSidebar";
import ProfileDropdown from "../components/ProfileDropdown";

interface Props {
  children: React.ReactElement;
  index: number;
}

const DashboardLayout = (props: Props) => {
  return (
    <div className={styles.with_sidebar}>
      <div>
        <DashboardSidebar index={0} />
        <div className={styles.container}>
          <ProfileDropdown />
          <div className={styles.container_content}>{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
