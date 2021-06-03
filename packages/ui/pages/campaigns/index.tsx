import DashboardLayout from "layout/DashboardLayout";
import TitleBar from "layout/TitleBar";
import CampaignTable from "components/campaign/list/CampaignTable";
import DefaultViewLayout from "layout/DefaultViewLayout";

const CampaignsIndexPage = () => {
  return (
    <DashboardLayout index={0}>
      <>
        <TitleBar
          title="Campaigns"
          subtitle="View and manage your campaigns."
          actionText="+ Create Campaign"
          actionUrl="/campaigns/create"
        ></TitleBar>
        <DefaultViewLayout>
          <CampaignTable />
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default CampaignsIndexPage;
