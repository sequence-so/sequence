import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";
import { useRouter } from "next/router";
import Table from "components/Table";
import { GridRowParams } from "@material-ui/data-grid";

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
    width: 200,
    valueGetter: (params) => params.row.name ?? "Untitled",
  },
  {
    field: "count",
    headerName: "Users",
    // description: "This column has a value getter and is not sortable.",
    width: 150,
    valueGetter: (params) => params.row.audience.count ?? "-",
  },
  {
    field: "createdAtFormatted",
    headerName: "Sent",
    type: "string",
    width: 180,
    valueGetter: (params) => moment(params.row.sentAt).format("MMMM DD, YYYY"),
  },
];

const CampaignTable = () => {
  const { data, loading, error } = useQuery(GET_CAMPAIGNS);
  const router = useRouter();

  const onClick = (param: GridRowParams) => {
    router.push(`/campaigns/${param.id}`);
  };

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <p>An error occured: {error.message} </p>;
  }

  return (
    <Table
      rows={data.campaigns.nodes}
      onRowClick={onClick}
      columns={columns}
      page={0}
    ></Table>
  );
};

export default CampaignTable;
