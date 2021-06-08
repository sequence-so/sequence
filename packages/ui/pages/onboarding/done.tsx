import OnboardingLayout from "../../layout/OnboardingLayout";
import AlertSuccess from "../../components/AlertSuccess";

const DonePage = () => {
  return (
    <OnboardingLayout index={2}>
      <AlertSuccess nextRoute={"/blasts"} />
    </OnboardingLayout>
  );
};

export default DonePage;
