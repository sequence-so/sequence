import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import BlueButton from "../../components/BlueButton";
import styles from "../../styles/Home.module.css";
import GreenCheckmark from "../../public/green_check.svg";
import OnboardingLayout from "../../layout/OnboardingLayout";
import { useRouter } from "next/router";

const GET_INTEGRATIONS = gql`
  {
    getIntegrations {
      intercom
      segment
      postgres
    }
  }
`;

const Dashboard = () => {
  const router = useRouter();
  const { loading, error, data: integrations } = useQuery(GET_INTEGRATIONS, {
    fetchPolicy: "no-cache",
  });

  const content = loading ? (
    <CircularProgress />
  ) : error ? (
    <p>An error has occured: {error.message}</p>
  ) : (
    <div className={styles.integrations_grid}>
      {/* Postgres */}
      {integrations && integrations.getIntegrations.postgres && (
        <div className={styles.integration_box_done}>
          <img src={GreenCheckmark} />
          <span>Postgres</span>
        </div>
      )}
      {integrations && !integrations.getIntegrations.postgres && (
        <Link href="/onboarding/postgres">
          <div className={styles.integration_box}>Postgres</div>
        </Link>
      )}

      {/* Segment */}
      {integrations && integrations.getIntegrations.segment && (
        <div className={styles.integration_box_done}>
          <img src={GreenCheckmark} />
          <span>Segment</span>
        </div>
      )}
      {integrations && !integrations.getIntegrations.segment && (
        <Link href="/onboarding/segment">
          <div className={styles.integration_box}>Segment</div>
        </Link>
      )}

      {/* Intercom */}
      {integrations && integrations.getIntegrations.intercom && (
        <div className={styles.integration_box_done}>
          <img src={GreenCheckmark} />
          <span>Intercom</span>
        </div>
      )}
      {integrations && !integrations.getIntegrations.intercom && (
        <Link href="/onboarding/intercom">
          <div className={styles.integration_box}>Intercom</div>
        </Link>
      )}
    </div>
  );

  return (
    <OnboardingLayout index={1}>
      <>
        <h1>Integrations</h1>
        <p>Click to setup your first integration.</p>
        {content}
        <p className={styles.not_ready_text}>
          Not ready?{" "}
          <Link href="/onboarding/done">
            <span className={styles.bold_text}>Click here to Skip</span>
          </Link>
        </p>
        <BlueButton
          text="Next"
          onClick={(): void => {
            router.push("/onboarding/alert");
          }}
        />
      </>
    </OnboardingLayout>
  );
};

export default Dashboard;
