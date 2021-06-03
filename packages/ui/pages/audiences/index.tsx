import gql from "graphql-tag";
import DashboardLayout from "layout/DashboardLayout";
import TitleBar from "layout/TitleBar";
import AudienceTable from "components/audience/list/AudienceTable";
import DefaultViewLayout from "layout/DefaultViewLayout";

export const GET_UNIQUE_EVENTS = gql`
  query UniqueEvents {
    uniqueEventNames
  }
`;

const AudiencesListContent = () => {
  return (
    <>
      <div className="content">
        <AudienceTable />
      </div>
      <style jsx>{`
        .content {
          height: 700px;
          width: 100%;
        }
        h3 {
          margin-block-start: 0px;
          margin-block-end: 0px;
          font-weight: 600;
          font-size: 24px;
          line-height: 31px;
          color: #222325;
        }
      `}</style>
    </>
  );
};

const AudiencesList = () => {
  return (
    <DashboardLayout index={0}>
      <>
        <TitleBar
          title="Audiences"
          subtitle="View and manage your audiences."
          actionText="+ Create Audience"
          actionUrl="/audiences/create"
        ></TitleBar>
        <DefaultViewLayout>
          <AudiencesListContent />
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default AudiencesList;
