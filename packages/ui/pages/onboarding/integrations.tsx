import Link from "next/link";
import BlueButton from "../../components/BlueButton";
import styles from "../../styles/Home.module.css";
import OnboardingLayout from "../../layout/OnboardingLayout";
import { useRouter } from "next/router";
import IntegrationsContent from "../../components/IntegrationsContent";
import useErrorBoundary from "use-error-boundary";

const IntegrationsPage = () => {
  const router = useRouter();
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();
  const content = (
    <ErrorBoundary>
      <IntegrationsContent />
    </ErrorBoundary>
  );
  if (didCatch) {
    console.error(error);
  }

  return (
    <>
      <OnboardingLayout index={1}>
        <div className={"content"}>
          <h1>Integrations</h1>
          <p>Import your data quickly from the sources below.</p>

          <a
            href="https://sequence.gitbook.io/sequence/importing-data"
            target="blank"
          >
            <p>Read our documentation on data import here.</p>
          </a>

          {didCatch ? error.message : content}

          <p className={styles.not_ready_text}>
            Not ready?{" "}
            <Link href="/onboarding/done">
              <span className={styles.bold_text}>Click here to Skip</span>
            </Link>
          </p>
          <BlueButton
            text="Next"
            onClick={(): void => {
              router.push("/onboarding/done");
            }}
          />
        </div>
      </OnboardingLayout>
      <style jsx>{`
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 1rem;
        }
        a {
          color: #4191e4;
        }
      `}</style>
    </>
  );
};

export default IntegrationsPage;
