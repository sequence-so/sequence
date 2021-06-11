import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import EmailTable from "components/email/list/EmailTable";
import DefaultViewLayout from "layout/DefaultViewLayout";
import { PAGE_DEFAULTS } from "constants/page";

const EmailsIndexPage = () => {
  return (
    <DashboardLayout index={1}>
      <>
        <TitleBar
          icon={PAGE_DEFAULTS.emails.icon}
          {...PAGE_DEFAULTS.emails.index}
        ></TitleBar>
        <DefaultViewLayout>
          <EmailTable />
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default EmailsIndexPage;
