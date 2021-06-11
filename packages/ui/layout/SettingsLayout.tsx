import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import DashboardSidebar from "../components/DashboardSidebar";
import classNames from "classnames";
import { createGlobalState } from "react-hooks-global-state";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactElement;
  index: number;
}

const initialState = { navigationIndex: 0 };
const { useGlobalState } = createGlobalState(initialState);

const SettingsLayout = (props: Props) => {
  const [index, setIndex] = useGlobalState("navigationIndex");
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (router.pathname.indexOf("settings") > -1) {
      setIndex(5);
    }
  }, [router.isReady]);
  return (
    <div
      className={classNames(styles.with_sidebar, styles.with_dashboard_sidebar)}
    >
      <div>
        <DashboardSidebar
          index={index}
          onClick={({ index, route }: { index: number; route: string }) => {
            setIndex(index);
            router.push(route);
          }}
        />
        <div className={styles.container}>
          <div
            className={styles.container_content}
            style={{
              paddingLeft: 40,
              paddingRight: 40,
              paddingBottom: 40,
            }}
          >
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
