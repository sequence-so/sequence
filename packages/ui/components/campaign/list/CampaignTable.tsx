import { gql } from "@apollo/client";
import moment from "moment";
import { useRouter } from "next/router";
import { GridRowParams } from "@material-ui/data-grid";
import ServerPaginatedTable from "components/ServerPaginatedTable";

const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns {
      page
      rows
      nodes {
        id
        name
        audience {
          count
        }
        sentAt
        userId
        emailId
        audienceId
        createdAt
        updatedAt
      }
    }
  }
`;

export type Campaign = {
  id: string;
  name: string;
  sentAt: Date;
  userId: string;
  emailId: string;
  audienceId: string;
  createdAt: Date;
  updatedAt: Date;
};

const columns = [
  {
    field: "name2",
    headerName: "Name",
    width: 250,
    valueGetter: (params) => params.row.name ?? "Untitled",
  },
  {
    field: "count",
    headerName: "Users",
    // description: "This column has a value getter and is not sortable.",
    width: 250,
    valueGetter: (params) => params.row.audience.count ?? "-",
  },
  {
    field: "sentAt",
    headerName: "Sent",
    type: "string",
    width: 250,
    valueGetter: (params) => moment(params.row.sentAt).fromNow(),
  },
];

const BlastsTable = () => {
  const router = useRouter();

  const onClick = (param: GridRowParams) => {
    router.push(`/blasts/${param.id}`);
  };

  return (
    <ServerPaginatedTable
      gql={GET_CAMPAIGNS}
      getRows={(data) => data.campaigns.nodes}
      onRowClick={onClick}
      columns={columns}
    />
  );
};

export default BlastsTable;
