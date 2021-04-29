import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "../styles/Home.module.css";
import GreenCheckmark from "../public/green_check.svg";
import classNames from "classnames";

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
  console.log({ loading, integrations, error });

  return loading ? (
    <CircularProgress />
  ) : error ? (
    <p>An error has occured: {error.message}</p>
  ) : (
    <>
      <div className="container">
        <h3 style={{ alignSelf: "flex-start" }}>Databases</h3>
        <div className={styles.integrations_grid}>
          {/* Postgres */}
          {integrations && integrations.getIntegrations.postgres && (
            <div
              className={classNames(
                styles.integration_box_done,
                styles.integration
              )}
            >
              <img src={"/postgresql_elephant.svg"} width={35}></img>
              <span>Postgres</span>
            </div>
          )}
          {integrations && !integrations.getIntegrations.postgres && (
            <Link href="/onboarding/postgres">
              <div
                className={classNames(
                  styles.integration_box,
                  styles.integration
                )}
              >
                <img src={"/postgresql_elephant.svg"} width={35}></img>
                <span>Postgres</span>
              </div>
            </Link>
          )}
          {integrations && integrations.getIntegrations.mongodb && (
            <div
              className={classNames(
                styles.integration_box_done,
                styles.integration
              )}
            >
              <img src={"/mongodb.svg"} width={35}></img>
            </div>
          )}
          {integrations && !integrations.getIntegrations.mongo && (
            <Link href="/onboarding/integrations">
              <div
                className={classNames(
                  styles.integration_box,
                  styles.integration
                )}
              >
                <img src={"/mongodb.svg"} width={80} />
              </div>
            </Link>
          )}
        </div>
        <h3 style={{ alignSelf: "flex-start" }}>Product Events</h3>
        <div className={styles.integrations_grid}>
          {/* Segment */}
          {integrations && integrations.getIntegrations.segment && (
            <div
              className={classNames(
                styles.integration_box_done,
                styles.integration
              )}
            >
              <img src={"/segment_icon.svg"} width={35}></img>
              <span>Segment</span>
            </div>
          )}
          {integrations && !integrations.getIntegrations.segment && (
            <Link href="/onboarding/segment">
              <img src={"/segment_icon.svg"} width={35}></img>
              <div
                className={classNames(
                  styles.integration_box,
                  styles.integration
                )}
              >
                <span>Segment</span>
              </div>
            </Link>
          )}
        </div>
        <h3 style={{ alignSelf: "flex-start" }}>Customer Support</h3>
        <div className={styles.integrations_grid}>
          {/* Intercom */}
          {integrations && integrations.getIntegrations.intercom && (
            <div
              className={classNames(
                styles.integration_box_done,
                styles.integration
              )}
            >
              <img src={"/intercom.svg"} width={46}></img>
              <span>Intercom</span>
            </div>
          )}
          {integrations && !integrations.getIntegrations.intercom && (
            <Link href="/onboarding/intercom">
              <div
                className={classNames(
                  styles.integration_box,
                  styles.integration
                )}
              >
                <img src={"/intercom.svg"} width={46}></img>
                <span>Intercom</span>
              </div>
            </Link>
          )}
        </div>
        <h3 style={{ alignSelf: "flex-start" }}>Billing</h3>

        <div className={styles.integrations_grid}>
          {/* Stripe */}
          {integrations && integrations.getIntegrations.stripe && (
            <div
              className={classNames(
                styles.integration_box_done,
                styles.integration
              )}
            >
              <img src={"/stripe.svg"} width={46}></img>
            </div>
          )}
          {integrations && !integrations.getIntegrations.stripe && (
            <Link href="/onboarding/stripe">
              <div
                className={classNames(
                  styles.integration_box,
                  styles.integration
                )}
              >
                <img src={"/stripe.svg"} width={46}></img>
              </div>
            </Link>
          )}
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          padding: 1rem;
        }
        h3 {
          margin-block-end: 0rem;
        }
      `}</style>
    </>
  );
};

export default IntegrationsContent;
