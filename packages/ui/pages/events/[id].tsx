import { useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import EventTable from "../../components/EventTable";
import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import dynamic from "next/dynamic";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

const GET_EVENT = gql`
  query GetEvent($id: ID) {
    events(id: $id) {
      nodes {
        id
        name
        type
        source
        distinctId
        properties
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
    RenderContent = <p>Error.</p>;
  } else {
    RenderContent = <DynamicReactJson src={data} />;
  }

  return (
    <DashboardLayout index={3}>
      <>
        <TitleBar title="Event Explorer" subtitle="View your users."></TitleBar>
        <div style={{ width: "100%" }}>
          <p>Event ID: {id}</p>
          <div
            style={{
              height: "700px",
              width: "100%",
              marginTop: 8,
              paddingBottom: "2rem",
            }}
          >
            {RenderContent}
          </div>
        </div>
      </>
    </DashboardLayout>
  );
};

export default dynamic(() => Promise.resolve(EventPage), { ssr: false });
