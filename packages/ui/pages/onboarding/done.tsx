import OnboardingLayout from "../../layout/OnboardingLayout";
import AlertSuccess from "../../components/AlertSuccess";

const DonePage = () => {
  return (
    <OnboardingLayout index={4}>
      <AlertSuccess nextRoute={"/alerts"} />
    </OnboardingLayout>
  );
};

export default DonePage;
