import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "../styles/Home.module.css";
import GreenCheckmark from "../public/green_check.svg";

const GET_INTEGRATIONS = gql`
  {
    getIntegrations {
      intercom
      segment
      postgres
    }
  }
`;

const IntegrationsContent = () => {
  const { loading, error, data: integrations } = useQuery(GET_INTEGRATIONS, {
    fetchPolicy: "no-cache",
  });

  return loading ? (
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
};

export default IntegrationsContent;
