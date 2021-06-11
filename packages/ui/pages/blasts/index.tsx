import DashboardLayout from "layout/DashboardLayout";
import TitleBar from "layout/TitleBar";
import BlastTable from "components/blast/list/BlastTable";
import DefaultViewLayout from "layout/DefaultViewLayout";
import { PAGE_DEFAULTS } from "constants/page";

const BlastsIndexPage = () => {
  return (
    <DashboardLayout index={0}>
      <>
        <TitleBar
          icon={PAGE_DEFAULTS.blasts.icon}
          {...PAGE_DEFAULTS.blasts.index}
        ></TitleBar>
        <DefaultViewLayout>
          <BlastTable />
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default BlastsIndexPage;
