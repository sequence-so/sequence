import React from "react";
import useErrorBoundary from "use-error-boundary";

interface Props {
  children: React.ReactElement;
  index: number;
}

const OnboardingContent = (props: Props) => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();

  return (
    <>
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

export default OnboardingContent;
