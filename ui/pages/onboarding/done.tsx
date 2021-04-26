import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import BlueButton from "../../components/BlueButton";
import GreenCheckmark from "../../public/green_check.svg";
import OnboardingLayout from "../../layout/OnboardingLayout";

const DonePage = () => {
  const router = useRouter();
  return (
    <OnboardingLayout index={4}>
      <div
        className={styles.container_content}
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100% - 100px)",
          marginTop: 60,
        }}
      >
        <img src={GreenCheckmark} style={{ width: 60 }} />
        <h1>You’re All Set!</h1>
        <p>You’ve configured your alerts successfully.</p>
        <p>
          Click below to explore your dashboard and see how else Hoco can help
          you improve.{" "}
        </p>

        <BlueButton
          text="View Dashboard"
          onClick={(): void => {
            router.push("/dashboard");
          }}
        />
      </div>
    </OnboardingLayout>
  );
};

export default DonePage;
