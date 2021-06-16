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
import { GET_CAMAPIGNS } from "../CampaignQueries";
import { GetEmails_emails_nodes } from "__generated__/GetEmails";

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

interface CampaignTableProps {
  onClick?: (email: GetEmails_emails_nodes) => void;
  shadow?: boolean;
}

const CampaignTable = (props?: CampaignTableProps) => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any>();
  const shadow = defaultProp(props.shadow, true);
  const onClick = useMemo(
    () => (param: GridRowParams) => {
      const id = param.id;
      const campaign = campaigns.campaigns.nodes.find((elem) => elem.id === id);
      if (!campaign) {
        return;
      }
      if (props?.onClick) {
        props.onClick(campaign);
      } else {
        router.push(`/campaigns/${id}`);
      }
    },
    [campaigns]
  );

  return (
    <ServerPaginatedTable<GetCampaigns>
      columns={columns}
      gql={GET_CAMAPIGNS}
      onReceivedData={(data: GetCampaigns_campaigns_nodes) =>
        setCampaigns(data)
      }
      getRows={(data) => {
        return data.campaigns.nodes;
      }}
      queryOptions={{ fetchPolicy: "no-cache" }}
      onRowClick={onClick}
      shadow={shadow}
    />
  );
};

export default CampaignTable;
