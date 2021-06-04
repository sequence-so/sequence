import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import EmailTable from "components/email/list/EmailTable";
import DefaultViewLayout from "layout/DefaultViewLayout";

const EmailsIndexPage = () => {
  return (
    <DashboardLayout index={1}>
      <>
        <TitleBar
          title="Emails"
          subtitle="View all of the emails you've created and sent to customers."
          actionUrl="/emails/create"
          actionText="+ Create Email"
        ></TitleBar>
        <DefaultViewLayout>
          <EmailTable />
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default EmailsIndexPage;
