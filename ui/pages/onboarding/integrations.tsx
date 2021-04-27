import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import BlueButton from "../../components/BlueButton";
import styles from "../../styles/Home.module.css";
import OnboardingLayout from "../../layout/OnboardingLayout";
import { useRouter } from "next/router";
import IntegrationsContent from "../../components/IntegrationsContent";

const GET_INTEGRATIONS = gql`
  {
    getIntegrations {
      intercom
      segment
      postgres
    }
  }
`;

const IntegrationsPage = () => {
  const router = useRouter();

  const content = <IntegrationsContent />;

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

export default IntegrationsPage;
