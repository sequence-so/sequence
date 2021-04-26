import React from "react";
import styles from "../styles/Home.module.css";
import DashboardSidebar from "../components/DashboardSidebar";
import ProfileDropdown from "../components/ProfileDropdown";
import classNames from "classnames";

interface Props {
  children: React.ReactElement;
  index: number;
}

const DashboardLayout = (props: Props) => {
  return (
    <div
      className={classNames(styles.with_sidebar, styles.with_dashboard_sidebar)}
    >
      <div>
        <DashboardSidebar index={0} />
        <div className={styles.container}>
          <ProfileDropdown />
          <div
            className={styles.container_content}
            style={{
              paddingLeft: 40,
              paddingRight: 40,
              paddingBottom: 10,
            }}
          >
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
