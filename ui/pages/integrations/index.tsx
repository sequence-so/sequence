import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import IntegrationsContent from "../../components/IntegrationsContent";

const IntegrationsPage = () => {
  return (
    <DashboardLayout index={2}>
      <>
        <TitleBar
          title="Integrations"
          subtitle="Update integrations."
        ></TitleBar>
        <IntegrationsContent />
      </>
    </DashboardLayout>
  );
};

export default IntegrationsPage;
