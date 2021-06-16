import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import DashboardSidebar from "../components/DashboardSidebar";
import Navbar from "../components/Navbar";
import classNames from "classnames";
import { createGlobalState } from "react-hooks-global-state";
import { useRouter } from "next/router";
import { SIDEBAR_LIST } from "constants/page";
import { defaultProp } from "services/defaultProp";
import { useWindowDimensions } from "hooks/useWindowDimensions";

interface Props {
  children: React.ReactElement;
  index: number;
  fullBleed?: boolean;
  navbar?: boolean;
}

const initialState = { navigationIndex: 0, isSidebarOpen: true };
export const { useGlobalState } = createGlobalState(initialState);

const getSidebarIndex = (pathname: string) => {
  return SIDEBAR_LIST.findIndex((elem) => elem.route.indexOf(pathname) > -1);
};

export const DashboardContext = React.createContext({ contentPaneHeight: -1 });

const DashboardLayout = (props: Props) => {
  const [index, setIndex] = useGlobalState("navigationIndex");
  const { width, height } = useWindowDimensions();
  const [isSidebarOpen, setSidebarOpen] = useGlobalState("isSidebarOpen");
  const router = useRouter();
  const contentPaneRef = useRef<HTMLDivElement | null>(null);
  const [contentPaneWidth, setContentPaneWidth] = useState(-1);
  const fullBleed = defaultProp(props.fullBleed, false);
  const navbar = defaultProp(props.navbar, true);
  const [contentPaneHeight, setContentPaneHeight] = useState(-1);

  // if sidebar minimized/maximize, update content pane width
  useEffect(() => {
    if (contentPaneRef.current?.clientWidth) {
      setContentPaneWidth(contentPaneRef.current?.clientWidth);
    }
    setContentPaneHeight;
  }, [isSidebarOpen]);

  useEffect(() => {
    setContentPaneHeight(height - 71);
  }, [height]);

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
            {navbar && <Navbar />}
            <div
              className={styles.container_content}
              style={{
                paddingLeft: !fullBleed ? 40 : 0,
                paddingRight: !fullBleed ? 40 : 0,
                paddingBottom: !fullBleed ? 40 : 0,
                width: "100%",
                height: "auto",
              }}
              ref={(ref): void => {
                contentPaneRef.current = ref;
              }}
            >
              <DashboardContext.Provider value={{ contentPaneHeight }}>
                {props.children}
              </DashboardContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
