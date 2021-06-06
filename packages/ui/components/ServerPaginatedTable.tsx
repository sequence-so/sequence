import { QueryHookOptions, useQuery } from "@apollo/client";
import { CircularProgress, makeStyles } from "@material-ui/core";
import {
  DataGrid,
  DataGridProps,
  GridCellParams,
  GridColumns,
  GridPageChangeParams,
} from "@material-ui/data-grid";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { useMemo, useState } from "react";
import { defaultProp } from "services/defaultProp";
import Table from "./Table";

type ServerPaginateTableProps = Partial<DataGridProps> & {
  gql: DocumentNode;
  getRows: (elem: any) => any[];
  variables?: Record<string, any>;
  queryOptions?: QueryHookOptions<any, Record<string, any>>;
  shadow: boolean;
};

const DEFAULT_LIMIT = 10;

const ServerPaginatedTable = (props: ServerPaginateTableProps) => {
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState(-1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const { data, loading, error } = useQuery(props.gql, {
    onCompleted(data) {
      const key = Object.keys(data)[0];
      setRowCount(data[key].rows);
    },
    variables: props.variables,
    ...props.queryOptions,
  });
  const shadow = defaultProp(props.shadow, true);
  const onPageChange = (params: GridPageChangeParams) => {
    setPage(params.page);
  };

  if (error) {
    return <p>An error occured loading this table: {error.message}</p>;
  }
  const rows = useMemo(
    () => (loading ? [] : props.getRows(data)),
    [loading, data, rowCount]
  );

  if (loading || rowCount === -1) {
    return <CircularProgress />;
  }

  return (
    <Table
      loading={loading}
      columns={props.columns}
      rows={rows}
      pageSize={limit}
      page={page}
      rowCount={rowCount}
      onPageChange={onPageChange}
      pagination
      paginationMode="server"
      shadow={shadow}
      {...props}
    />
  );
};

export default ServerPaginatedTable;
