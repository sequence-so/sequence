import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";
import { useRouter } from "next/router";
import Table from "components/Table";
import AudienceTableRow from "./AudienceTableRow";
import { GridRowParams } from "@material-ui/data-grid";
import { memo, useMemo } from "react";
import { defaultProp } from "services/defaultProp";

const GET_AUDIENCES = gql`
  query GetAudiences {
    audiences {
      page
      rows
      nodes {
        id
        name
        node
        count
        executedAt
        createdAt
        updatedAt
      }
    }
  }
`;

export type Audience = {
  id: string;
  name: string;
  node: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
  executedAt: Date;
};

interface Props {
  onClick?: (audience: Audience) => void;
  shadow?: boolean;
}

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

const RenderEmptyAudiences = () => {
  return (
    <div>
      <h2>No Audiences Found</h2>
      <p>
        To create an Audience, click here. You can also read our documentation
        on importing data here:{" "}
      </p>
    </div>
  );
};

const AudienceTable = (props?: Props) => {
  const { data, loading, error } = useQuery(GET_AUDIENCES);
  const shadow = defaultProp(props.shadow, true);
  const router = useRouter();
  const onClick = useMemo(
    () => (param: GridRowParams) => {
      const id = param.id;
      const audience = data.audiences.nodes.find((elem) => elem.id === id);
      if (!audience) {
        return;
      }
      if (props?.onClick) {
        props.onClick(audience);
      } else {
        router.push(`/audiences/${id}`);
      }
    },
    [data?.audiences]
  );

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <p>An error occured: {error.message} </p>;
  }

  if (data.audiences.nodes.length === 0) {
    return <RenderEmptyAudiences />;
  }

  return (
    <Table
      rows={data.audiences.nodes}
      onRowClick={onClick}
      columns={columns}
      page={0}
      shadow={shadow}
    ></Table>
  );
};

export default AudienceTable;
