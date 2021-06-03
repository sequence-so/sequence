import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import classnames from "classnames";
import BlueButton from "../../components/BlueButton";
import OnboardingLayout from "../../layout/OnboardingLayout";

const OnboardingPage = () => {
  const router = useRouter();
  return (
    <>
      <OnboardingLayout index={0}>
        <div className="content">
          <h1>Welcome to Sequence!</h1>
          <p>
            Sequence alerts you of important user behavior so you can convert
            your free trials more effectively.
          </p>
          <p>Setup is simple:</p>

          <div className={classnames(styles.onboarding_box_row)}>
            <div
              className={classnames(
                styles.onboarding_box,
                styles.onboarding_box_red
              )}
            >
              <div className={styles.onboarding_box_number}>1.</div>
              <div className={styles.onboarding_box_content}>
                Connect to <br />
                Your
                <br /> Datasources
              </div>
            </div>
            <div
              className={classnames(
                styles.onboarding_box,
                styles.onboarding_box_blue
              )}
            >
              <div className={styles.onboarding_box_number}>2.</div>
              <div className={styles.onboarding_box_content}>
                Configure <br />
                Key Product <br />
                Events
              </div>
            </div>
            <div
              className={classnames(
                styles.onboarding_box,
                styles.onboarding_box_purple
              )}
            >
              <div className={styles.onboarding_box_number}>3.</div>
              <div className={styles.onboarding_box_content}>
                Create an
                <br /> Alert and Be <br />
                Notified
              </div>
            </div>
          </div>
          <BlueButton
            text={"Next"}
            onClick={(): void => {
              router.push("/onboarding/integrations");
            }}
          />
        </div>
      </OnboardingLayout>
      <style jsx>{`
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default OnboardingPage;
