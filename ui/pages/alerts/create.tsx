import DashboardLayout from "../../layout/DashboardLayout";
import CreateAlertContent from "../../components/CreateAlert";

const CreateAlertPage = () => {
  return (
    <DashboardLayout index={2}>
      <>
        <div style={{ marginTop: 28, height: 1 }}></div>
        <CreateAlertContent
          nextRoute={"/alerts/message"}
          renderSkip={false}
          renderHeader={true}
        />
      </>
    </DashboardLayout>
  );
};

export default CreateAlertPage;
