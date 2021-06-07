import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import DashboardSidebar from "../components/DashboardSidebar";
import Navbar from "../components/Navbar";
import classNames from "classnames";
import { createGlobalState } from "react-hooks-global-state";
import { useRouter } from "next/router";
interface Props {
  children: React.ReactElement;
  index: number;
}

const initialState = { navigationIndex: 0, isSidebarOpen: true };
export const { useGlobalState } = createGlobalState(initialState);

const getSidebarIndex = (pathname: string) => {
  if (pathname.indexOf("explorer") > -1) {
    return 3;
  }
  if (pathname.indexOf("settings") > -1) {
    return 4;
  }
  if (pathname.indexOf("blasts") > -1) {
    return 0;
  }
  if (pathname.indexOf("audiences") > -1) {
    return 1;
  }
  if (pathname.indexOf("emails") > -1) {
    return 2;
  }
};

const DashboardLayout = (props: Props) => {
  const [index, setIndex] = useGlobalState("navigationIndex");
  const [isSidebarOpen, setSidebarOpen] = useGlobalState("isSidebarOpen");
  const router = useRouter();
  const contentPaneRef = useRef<HTMLDivElement | null>(null);
  const [contentPaneWidth, setContentPaneWidth] = useState(0);

  // if sidebar minimized/maximize, update content pane width
  useEffect(() => {
    if (contentPaneRef.current?.clientWidth) {
      setContentPaneWidth(contentPaneRef.current?.clientWidth);
    }
  }, [isSidebarOpen]);

  // once we get a ref for the content pane, update content pane width
  useEffect(() => {
    const width = contentPaneRef.current?.clientWidth;
    if (width) {
      setContentPaneWidth(width);
    }
  }, [contentPaneRef.current]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setIndex(getSidebarIndex(router.pathname));
  }, [router.isReady]);

  return (
    <div className={classNames(styles.page)}>
      <div className={styles.with_dashboard_sidebar}>
        <div style={{ display: "flex" }}>
          <DashboardSidebar
            index={index}
            onClick={({ index, route }: { index: number; route: string }) => {
              setIndex(index);
              router.push(route);
            }}
          />
          <div className={styles.container}>
            <Navbar />
            <div
              className={styles.container_content}
              style={{
                paddingLeft: 40,
                paddingRight: 40,
                paddingBottom: 40,
                width: "100%",
                height: "auto",
              }}
              ref={(ref): void => {
                contentPaneRef.current = ref;
              }}
            >
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
