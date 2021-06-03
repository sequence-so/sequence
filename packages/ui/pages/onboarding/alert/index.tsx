import OnboardingLayout from "../../../layout/OnboardingLayout";
import CreateAlertContent from "../../../components/CreateAlert";

const OnboardingAlertPage = () => {
  return (
    <OnboardingLayout index={2}>
      <CreateAlertContent nextRoute={"/onboarding/message"} />
    </OnboardingLayout>
  );
};

export default OnboardingAlertPage;
