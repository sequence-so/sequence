import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import DashboardLayout from "layout/DashboardLayout";
import TitleBar from "layout/TitleBar";
import ProductUserTable from "components/UserTable";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import DynamicTitleBar from "components/DynamicTitleBar";
import DefaultViewLayout from "layout/DefaultViewLayout";
import Link from "next/link";
import ServerPaginatedTable from "components/ServerPaginatedTable";
import homeStyles from "styles/Home.module.css";
import moment from "moment";
import { GridCellParams } from "@material-ui/data-grid";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

export const GET_CAMPAIGN = gql`
  query GetCampaign($id: ID) {
    campaigns(id: $id) {
      page
      rows
      nodes {
        id
        name
        sentAt
        userId
        emailId
        audience {
          productUsers {
            id
            firstName
            lastName
          }
        }
        audienceId
        createdAt
        updatedAt
      }
    }
  }
`;

export const columns = [
  {
    field: "full_name",
    headerName: "User",
    width: 200,
    renderCell: (params: GridCellParams) => (
      <Link href={`/explorer/${params.getValue("externalId")}`}>
        <a>
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <div className={homeStyles.initials_circle}>
              {(params.getValue("firstName") as any).substring(0, 1)}
              {(params.getValue("lastName") as any)?.substring(0, 1)}
            </div>
            {params.getValue("firstName") as any}{" "}
            {params.getValue("lastName") as any}
          </div>
        </a>
      </Link>
    ),
  },
  {
    field: "date",
    headerName: "Date",
    type: "string",
    width: 180,
    valueGetter: (params) =>
      moment(params.getValue("createdAt")).format("MMMM DD, YYYY"),
  },
  {
    field: "email",
    headerName: "Email",
    description: "This column has a value getter and is not sortable.",
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    description: "This column has a value getter and is not sortable.",
    width: 150,
  },
  {
    field: "lastSeenAt",
    headerName: "Last Seen At",
    description: "This column has a value getter and is not sortable.",
    width: 150,
  },
];

const CampaignByIdPage = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_CAMPAIGN, {
    variables: {
      id: router.query.id,
    },
  });
  const content = loading ? (
    <CircularProgress />
  ) : error ? (
    <p>An error occured: {error.message}</p>
  ) : (
    <>
      <Link href={`/emails/${data.campaigns.nodes[0].emailId}`}>
        <a>View Email</a>
      </Link>
      <Link href={`/audiences/${data.campaigns.nodes[0].audienceId}`}>
        <a>View Audience</a>
      </Link>
      <h4>SENT TO:</h4>
      <ServerPaginatedTable
        variables={{ id: router.query.id }}
        gql={GET_CAMPAIGN}
        columns={columns}
        getRows={(data) => data.campaigns.nodes[0].audience.productUsers}
      />
      <style jsx>{`
        h4 {
          margin-block-start: 1em;
          margin-block-end: 1em;
          color: #4e4f55;
          font-weight: 600;
        }
      `}</style>
    </>
  );

  return (
    <DashboardLayout index={0}>
      <DefaultViewLayout>
        <>
          <DynamicTitleBar
            title={data?.campaigns?.nodes[0].name}
            onChangeTitleText={(text: string) => {}}
            subtitle="View and manage your campaigns."
            showAction={false}
          />
          {content}
        </>
      </DefaultViewLayout>
    </DashboardLayout>
  );
};

export default dynamic(() => Promise.resolve(CampaignByIdPage), { ssr: false });
