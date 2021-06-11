import { useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";
import { useRouter } from "next/router";
import Table from "components/Table";
import { GridRowParams } from "@material-ui/data-grid";
import { useMemo } from "react";
import { defaultProp } from "services/defaultProp";
import { GET_AUDIENCES } from "../AudienceQueries";
import { GetAudiences_audiences_nodes } from "__generated__/GetAudiences";

interface Props {
  onClick?: (audience: GetAudiences_audiences_nodes) => void;
  shadow?: boolean;
}

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
    valueGetter: (params) => params.row.name ?? "Untitled",
  },
  {
    field: "count",
    headerName: "Users",
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Created",
    type: "string",
    width: 250,
    valueGetter: (params) => moment(params.row.createdAt).fromNow(),
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
  const { data, loading, error } = useQuery(GET_AUDIENCES, {
    fetchPolicy: "no-cache",
  });
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
