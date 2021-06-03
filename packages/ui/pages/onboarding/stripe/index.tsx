import Link from "next/link";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/Home.module.css";
import AuthStripe from "../../../components/AuthStripe";
import OnboardingLayout from "../../../layout/OnboardingLayout";

const IntercomPage = () => {
  return (
    <>
      <OnboardingLayout index={1}>
        <div className={classNames(styles.container_content, "content")}>
          <Link href="/onboarding/integrations">
            <p className={classNames(styles.go_back, styles.bold_text)}>
              <FontAwesomeIcon icon={faChevronLeft} width={10} />
              <span>Back</span>
            </p>
          </Link>
          <h1>Stripe</h1>
          <p style={{ textAlign: "center" }}>
            Click below to integrate with Stripe. <br />
            <br />
            The data will be used to populate your user list for contextual
            notifications.
          </p>
          <div className="auth_button">
            <AuthStripe />
          </div>
        </div>
      </OnboardingLayout>
      <style jsx>{`
        .content {
          width: 100%;
          height: 100%;
          padding: 1rem;
        }
        p {
          font-size: 1rem;
          line-height: 1rem;
          text-align: center;
          color: #4e4f55;
        }
        .auth_button {
          margin-top: 2.5rem;
        }
      `}</style>
    </>
  );
};

export default IntercomPage;
