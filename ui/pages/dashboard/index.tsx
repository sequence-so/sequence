import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";

const Dashboard = () => {
  return (
    <DashboardLayout index={0}>
      <TitleBar
        title="My Alerts"
        subtitle="Manage your alerts and view your history."
      ></TitleBar>
    </DashboardLayout>
  );
};

export default Dashboard;
