import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import CampaignTable from "components/campaign/list/CampaignTable";
import DefaultViewLayout from "layout/DefaultViewLayout";
import { PAGE_DEFAULTS } from "constants/page";

const CampaignsIndexPage = () => {
  return (
    <DashboardLayout index={1}>
      <>
        <TitleBar
          icon={PAGE_DEFAULTS.campaigns.icon}
          title={PAGE_DEFAULTS.campaigns.index.title}
          subtitle={PAGE_DEFAULTS.campaigns.index.subtitle}
          actionUrl={PAGE_DEFAULTS.campaigns.index.actionUrl}
          actionText={PAGE_DEFAULTS.campaigns.index.actionText}
        ></TitleBar>
        <DefaultViewLayout>
          <CampaignTable />
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default CampaignsIndexPage;
