import React from "react";
import classNames from "classnames";
import useErrorBoundary from "use-error-boundary";
import styles from "../styles/Home.module.css";
import OnboardingSidebar from "../components/OnboardingSidebar";
import dynamic from "next/dynamic";
import OnboardingContent from "../components/OnboardingContent";

const NavbarNoSSR = dynamic(() => import("../components/Navbar"), {
  ssr: false,
});

interface Props {
  children: React.ReactElement;
  index: number;
}

const OnboardingLayout = (props: Props) => {
  return (
    <>
      <div className={classNames(styles.page)}>
        <div className={styles.with_dashboard_sidebar}>
          <div style={{ display: "flex" }}>
            <OnboardingSidebar index={props.index} />
            <div className={classNames(styles.container)}>
              <img
                className={styles["onboarding-backdrop"]}
                src="/crosses_backdrop.svg"
              ></img>
              <NavbarNoSSR />
              <OnboardingContent index={props.index}>
                {props.children}
              </OnboardingContent>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .onboarding-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-bottom: 3rem;
          padding-top: 3rem;
        }
        .onboarding-backdrop {
        }
        .onboarding-box {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 50vw;
          max-width: 55vw;
          min-height: 70vh;
          z-index: 2;
          background: white;
          box-shadow: 0px 0px 0px 1px rgba(15, 15, 15, 0.05),
            0px 3px 6px rgba(15, 15, 15, 0.1),
            0px 9px 24px rgba(15, 15, 15, 0.2);
          border-radius: 14px;
        }
        .onboarding-inner-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 2rem;
        }
      `}</style>
    </>
  );
};

export default OnboardingLayout;
