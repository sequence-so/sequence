import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../../styles/Home.module.css";
import OnboardingLayout from "../../../layout/OnboardingLayout";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import PostgresForm from "../../../components/PostgresForm";

const PostgresPage = () => {
  const router = useRouter();

  return (
    <OnboardingLayout index={1}>
      <div className={classnames(styles.container_content)}>
        <Link href="/onboarding/integrations">
          <p className={classnames(styles.go_back, styles.bold_text)}>
            <FontAwesomeIcon icon={faChevronLeft} width={10} />
            <span>Back</span>
          </p>
        </Link>
        <h1>Postgres Connection</h1>
        <p>Provides secure access to your Postgres database.</p>
        <PostgresForm
          onSuccess={() => {
            router.push("/onboarding/integrations");
          }}
        />
        <p className={styles.not_ready_text}>
          <Link href="/onboarding/datasources">
            <>
              Not ready?{" "}
              <span className={styles.bold_text}>Click here to Skip</span>
            </>
          </Link>
        </p>
      </div>
    </OnboardingLayout>
  );
};

export default PostgresPage;
