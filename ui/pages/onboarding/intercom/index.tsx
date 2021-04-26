import Link from "next/link";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/Home.module.css";
import AuthIntercom from "../../../components/AuthIntercom";
import OnboardingLayout from "../../../layout/OnboardingLayout";

const IntercomPage = () => {
  return (
    <OnboardingLayout index={1}>
      <div className={styles.container_content}>
        <Link href="/onboarding/integrations">
          <p className={classNames(styles.go_back, styles.bold_text)}>
            <FontAwesomeIcon icon={faChevronLeft} width={10} />
            <span>Go back</span>
          </p>
        </Link>
        <h1>Connect Intercom</h1>
        <p style={{ textAlign: "center", marginBottom: 40 }}>
          Click below to integrate with Intercom. <br />
          <br />
          The data will be used to populate your user list for contextual
          notifications.
        </p>
        <AuthIntercom />
      </div>
    </OnboardingLayout>
  );
};

export default IntercomPage;
