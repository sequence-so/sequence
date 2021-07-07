import { useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import dynamic from "next/dynamic";
import { PAGE_DEFAULTS } from "constants/page";
import DefaultViewLayout from "layout/DefaultViewLayout";
import GQLErrorMessage from "components/GQLErrorMessage";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

const GET_EVENT = gql`
  query GetEvent($id: ID) {
    events(id: $id) {
      nodes {
        id
        name
        type
        source
        personId
        properties
        timestamp
        messageId
        sentAt
        receivedAt
        context
        productUser {
          firstName
          lastName
        }
        createdAt
        updatedAt
      }
      page
      rows
    }
  }
`;

const EventPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: {
      id,
    },
  });

  let RenderContent = <></>;
  if (loading) {
    RenderContent = <CircularProgress />;
  } else if (error) {
    RenderContent = <GQLErrorMessage error={error.message} />;
  } else {
    RenderContent = <DynamicReactJson src={data} />;
  }

  return (
    <DashboardLayout index={3}>
      <>
        <TitleBar
          title={data?.events?.nodes[0].name}
          subtitle={PAGE_DEFAULTS.events.id.title}
          showAction={false}
        ></TitleBar>
        <DefaultViewLayout>{RenderContent}</DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default dynamic(() => Promise.resolve(EventPage), { ssr: false });
