import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import { Condition } from "common/filters/";
import AudienceBuilder from "components/AudienceBuilder";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import DefaultViewLayout from "layout/DefaultViewLayout";

export const GET_UNIQUE_EVENTS = gql`
  query UniqueEvents {
    uniqueEventNames
  }
`;

const AudienceBuilderContent = () => {
  return (
    <>
      <div className="content">
        <AudienceBuilder rootNode={Condition.and()} />
      </div>
      <style jsx>{`
        .content {
          border: var(--border-grey);
          border-radius: 4px;
          box-shadow: var(--subtle-shadow);
          padding: 21px 17px;
          border-radius: 4px;
          margin-bottom: 4em;
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

const AudienceBuilderPage = () => {
  const { data, loading, error } = useQuery(GET_UNIQUE_EVENTS);

  return (
    <DashboardLayout index={0}>
      <>
        <TitleBar
          title="Audience Builder"
          subtitle="Filter your Users by their attributes and actions."
          showAction={false}
          actionDisabled={true}
        ></TitleBar>
        <DefaultViewLayout>
          <AudienceBuilderContent />
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default AudienceBuilderPage;
