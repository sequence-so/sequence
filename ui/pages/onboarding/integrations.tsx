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
          <p>Click to setup your first integration.</p>
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
              router.push("/onboarding/alert");
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
      `}</style>
    </>
  );
};

export default IntegrationsPage;
