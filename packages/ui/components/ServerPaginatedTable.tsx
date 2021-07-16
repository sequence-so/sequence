import { QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { DataGridProps, GridPageChangeParams } from "@material-ui/data-grid";
import { DocumentNode } from "graphql";
import { useEffect, useMemo, useState } from "react";
import { defaultProp } from "services/defaultProp";
import Table from "./Table";

type ServerPaginateTableProps<T> = Partial<DataGridProps> & {
  gql: DocumentNode;
  getRows: (elem: T) => any[];
  onReceivedData?: (elem: any) => void;
  variables?: Record<string, any>;
  queryOptions?: QueryHookOptions<any, Record<string, any>>;
  shadow?: boolean;
};

const DEFAULT_LIMIT = 10;

function ServerPaginatedTable<T>(props: ServerPaginateTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState(-1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [executeQuery, { data, loading, error }] = useLazyQuery(props.gql, {
    onCompleted(data) {
      const key = Object.keys(data)[0];
      setRowCount(data[key].rows);
      props.onReceivedData ? props.onReceivedData(data) : null;
    },
    variables: props.variables,
    ...props.queryOptions,
  });
  const shadow = defaultProp(props.shadow, true);
  const onPageChange = (params: GridPageChangeParams) => {
    setPage(params.page);
    executeQuery({
      variables: {
        page: params.page,
        ...props.variables,
      },
      ...props.queryOptions,
    });
  };

  const rows = useMemo(
    () => (loading ? [] : data ? props.getRows(data) : []),
    [loading, data, rowCount]
  );

  useEffect(() => executeQuery(), []);

  if (error) {
    return <p>An error occured loading this table: {error.message}</p>;
  }
  if (rowCount === -1) {
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
      autoHeight={true}
      {...props}
    />
  );
}

export default ServerPaginatedTable;
