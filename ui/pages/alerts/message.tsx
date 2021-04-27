import DashboardLayout from "../../layout/DashboardLayout";
import MessageContent from "../../components/MessageContent";

const CreateAlertMessagePage = () => {
  return (
    <DashboardLayout index={2}>
      <>
        <div style={{ marginTop: 28, height: 1 }}></div>
        <MessageContent nextRoute={"/alerts/success"} />
      </>
    </DashboardLayout>
  );
};

export default CreateAlertMessagePage;
