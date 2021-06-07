import { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Condition } from "common/filters/";
import AudienceBuilder from "components/AudienceBuilder";
import DynamicTitleBar from "components/DynamicTitleBar";
import DefaultViewLayout from "layout/DefaultViewLayout";

export const GET_UNIQUE_EVENTS = gql`
  query UniqueEvents {
    uniqueEventNames
  }
`;

const AudienceBuilderPage = () => {
  // prefetch event names
  useQuery(GET_UNIQUE_EVENTS);
  const [title, setTitle] = useState("");

  const onChangeTitle = (name: string) => {
    setTitle(name);
  };

  return (
    <DashboardLayout index={0}>
      <>
        <DynamicTitleBar
          title={title}
          placeholderTitle="Untitled Audience"
          subtitle="The Audience Builder lets you filter by People's attributes and events."
          onChangeTitleText={onChangeTitle}
          showAction={false}
        />

        <DefaultViewLayout>
          <div className="content">
            <AudienceBuilder name={title} rootNode={Condition.and()} />
          </div>
        </DefaultViewLayout>
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
    </DashboardLayout>
  );
};

export default AudienceBuilderPage;
