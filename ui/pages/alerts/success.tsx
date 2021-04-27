import AlertSuccess from "../../components/AlertSuccess";
import DashboardLayout from "../../layout/DashboardLayout";

const CreateAlertMessagePage = () => {
  return (
    <DashboardLayout index={2}>
      <AlertSuccess nextRoute={"/alerts"} text2={""} />
    </DashboardLayout>
  );
};

export default CreateAlertMessagePage;
