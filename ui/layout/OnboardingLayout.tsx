import React from "react";
import classNames from "classnames";
import useErrorBoundary from "use-error-boundary";
import styles from "../styles/Home.module.css";
import OnboardingSidebar from "../components/OnboardingSidebar";
import Navbar from "../components/Navbar";

interface Props {
  children: React.ReactElement;
  index: number;
}

const OnboardingLayout = (props: Props) => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();

  return (
    <>
      <div className={classNames(styles.page)}>
        <div className={styles.with_dashboard_sidebar}>
          <div style={{ display: "flex" }}>
            <OnboardingSidebar index={props.index} />
            <div
              className={classNames(styles.container, "container-background")}
            >
              <img className="my-image" src="/crosses_backdrop.svg"></img>
              {/* <img className="my-image-2" src="/top_background_image.svg"></img> */}
              <Navbar />
              <div className={"onboarding-content"}>
                <div className="onboarding-box">
                  <div className="onboarding-inner-content">
                    {didCatch ? (
                      <p>An error has been catched: {error.message}</p>
                    ) : (
                      <ErrorBoundary
                        render={() => props.children}
                        renderError={(error) => JSON.stringify(error)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container-background {
        }

        .onboarding-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-bottom: 3rem;
          padding-top: 3rem;
        }

         {
          /* .container-background:before {
          position: absolute;
          display: block;
          background: url("/top_background_image.svg") no-repeat center center
            fixed;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;

          content: "";
          z-index: -1;
          min-height: 80%;
          min-width: 100%;
          width: 100%;
          height: auto;
          top: 0px;
          left: 0px;
        } */
        }
         {
          /* .container-background:after {
          position: absolute;
          display: block;
          background: url("/crosses_backdrop.svg") no-repeat center center fixed;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;

          content: "";
          z-index: -1;
          min-height: 80%;
          min-width: 800px;
          width: 100%;
          height: auto;
          bottom: 0px;
        } */
        }
        .my-image {
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          position: absolute;
          z-index: -4;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .my-image-2 {
          position: absolute;
          right: 0px;
          top: 0px;
          z-index: -4;
          width: 250%;
          height: 100%;
          overflow: hidden;
        }
        .onboarding-box {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 50vw;
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
