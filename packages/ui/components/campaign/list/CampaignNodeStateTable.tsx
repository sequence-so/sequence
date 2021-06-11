import { GridColumns, GridRowParams } from "@material-ui/data-grid";
import { useRouter } from "next/router";
import moment from "moment";
import { useMemo, useState } from "react";
import ServerPaginatedTable from "components/ServerPaginatedTable";
import { defaultProp } from "services/defaultProp";
import {
  GetCampaigns,
  GetCampaigns_campaigns_nodes,
} from "__generated__/GetCampaigns";
import {
  GET_CAMAPIGNS,
  GET_CAMPAIGN_NODE_WITH_STATES,
} from "../CampaignQueries";
import { GetEmails_emails_nodes } from "__generated__/GetEmails";
import { GetCampaignNodeWithStates } from "__generated__/GetCampaignNodeWithStates";

const columns: GridColumns = [
  {
    field: "name2",
    headerName: "Name",
    width: 200,
    valueGetter: (params) => params.row.name ?? "Untitled",
  },
  {
    field: "active",
    headerName: "Status",
    width: 300,
    valueGetter: (params) =>
      params.row.isDraft
        ? "Draft"
        : params.row.stoppedAt
        ? "Stopped"
        : params.row.launchedAt
        ? "Launched"
        : "None",
  },
  {
    field: "launchedAt",
    headerName: "Launched",
    // description: "This column has a value getter and is not sortable.",
    width: 200,
    valueGetter: (params) =>
      params.row.launchedAt
        ? moment(params.row.launchedAt).format("MMMM DD, YYYY")
        : "-",
  },
  {
    field: "stoppedAt",
    headerName: "Stopped",
    // description: "This column has a value getter and is not sortable.",
    width: 200,
    valueGetter: (params) =>
      params.row.stoppedAt
        ? moment(params.row.stoppedAt).format("MMMM DD, YYYY")
        : "-",
  },
  {
    field: "createdAtFormatted",
    headerName: "Created",
    type: "string",
    width: 180,
    valueGetter: (params) =>
      moment(params.row.createdAt).format("MMMM DD, YYYY"),
  },
];

interface CampaignNodeStateTableProps {
  campaignNodeId: string;
}

const CampaignNodeStateTable = (props: CampaignNodeStateTableProps) => {
  return (
    <ServerPaginatedTable<GetCampaignNodeWithStates>
      columns={columns}
      gql={GET_CAMPAIGN_NODE_WITH_STATES}
      getRows={(data) => {
        const campaignNodes = data.campaignNodes.nodes;
        if (campaignNodes && campaignNodes[0]) {
          return campaignNodes[0].campaignNodeStates;
        }
        return [];
      }}
      queryOptions={{ fetchPolicy: "no-cache" }}
      shadow={false}
    />
  );
};

export default CampaignNodeStateTable;
