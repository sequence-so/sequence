import DashboardLayout from "layout/DashboardLayout";
import TitleBar from "layout/TitleBar";
import CampaignTable from "components/campaign/list/CampaignTable";
import DefaultViewLayout from "layout/DefaultViewLayout";
import { PAGE_DEFAULTS } from "constants/page";

const BlastsIndexPage = () => {
  return (
    <DashboardLayout index={0}>
      <>
        <TitleBar {...PAGE_DEFAULTS.blasts.index}></TitleBar>
        <DefaultViewLayout>
          <CampaignTable />
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default BlastsIndexPage;
