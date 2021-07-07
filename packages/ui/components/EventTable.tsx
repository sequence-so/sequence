import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { GridCellParams, GridColumns } from "@material-ui/data-grid";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { GetEvents, GetEventsVariables } from "__generated__/GetEvents";
import homeStyles from "../styles/Home.module.css";
import { GET_EVENTS } from "./events/EventQueries";
import Table from "./Table";

const DEFAULT_LIMIT = 10;

interface EventTableProps {
  variables?: GetEventsVariables;
  columns?: GridColumns;
}

export const EVENTS_TABLE_COLUMNS = [
  {
    field: "name",
    headerName: "Name",
    width: 200,
    renderCell: (params: GridCellParams) => (
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <Link href={`/events/${params.row.id}`}>
          <a>
            <svg
              width="22"
              height="22"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: 8 }}
            >
              <path
                d="M13.7715 23.3656C12.0438 23.253 10.3849 22.6457 8.99274 21.6162C7.60057 20.5868 6.53389 19.1787 5.9199 17.5598C5.30591 15.9409 5.17053 14.1795 5.5299 12.4858C5.88927 10.7921 6.72824 9.23744 7.94673 8.00735C9.16522 6.77726 10.7118 5.92361 12.4021 5.5482C14.0923 5.17279 15.8549 5.29148 17.4795 5.8901C19.1042 6.48873 20.5223 7.54202 21.5649 8.92437C22.6075 10.3067 23.2305 11.9598 23.3595 13.6864L21.1994 13.8478C21.1013 12.5356 20.6279 11.2793 19.8355 10.2287C19.0431 9.17813 17.9653 8.37763 16.7306 7.92267C15.4958 7.46772 14.1563 7.37752 12.8717 7.66282C11.5871 7.94813 10.4117 8.59691 9.48567 9.53178C8.55962 10.4667 7.92201 11.6482 7.64888 12.9354C7.37576 14.2226 7.47865 15.5612 7.94528 16.7916C8.41191 18.022 9.22259 19.0922 10.2806 19.8745C11.3387 20.6569 12.5994 21.1184 13.9125 21.2041L13.7715 23.3656Z"
                fill={"#9FA1A4"}
              />
              <path
                d="M13.386 28.6849C10.6378 28.4983 8.00125 27.5251 5.79084 25.8814C3.58043 24.2378 1.88945 21.993 0.919551 19.4149C-0.0503438 16.8367 -0.25821 14.034 0.320744 11.341C0.899698 8.64797 2.24104 6.17831 4.18479 4.22655C6.12854 2.27479 8.59266 0.923303 11.2833 0.333277C13.9739 -0.25675 16.7774 -0.0604137 19.3595 0.898868C21.9417 1.85815 24.1934 3.53989 25.8461 5.74352C27.4988 7.94715 28.4829 10.5797 28.6808 13.3271L26.5911 13.4776C26.422 11.1311 25.5816 8.88271 24.17 7.00061C22.7584 5.11852 20.8353 3.68216 18.6299 2.86285C16.4245 2.04354 14.0301 1.87585 11.7321 2.37979C9.43403 2.88372 7.32945 4.03801 5.66932 5.70499C4.00918 7.37196 2.86356 9.48127 2.36908 11.7813C1.8746 14.0814 2.05214 16.4752 2.88052 18.6772C3.70889 20.8791 5.15315 22.7963 7.04103 24.2002C8.92891 25.604 11.1807 26.4352 13.528 26.5946L13.386 28.6849Z"
                fill={"#9FA1A4"}
              />
              <path
                d="M18.957 28.4394L14.9479 16.2519C14.6973 15.4901 15.4004 14.758 16.1717 14.9776L28.279 18.4254C28.9966 18.6298 29.2458 19.5196 28.7387 20.0669L26.3298 22.6666L31.4802 27.817C31.869 28.2057 31.871 28.8354 31.4848 29.2266L29.4542 31.2836C29.0644 31.6785 28.4277 31.6805 28.0354 31.2882L23.0035 26.2563L20.6404 28.8066C20.1226 29.3654 19.195 29.1631 18.957 28.4394Z"
                fill={"#9FA1A4"}
              />
            </svg>
            {params.row.name}
          </a>
        </Link>
      </div>
    ),
  },
  {
    field: "full_name",
    headerName: "User",
    width: 200,
    renderCell: (params: GridCellParams) => (
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <div className={homeStyles.initials_circle}>
          {(params.row.productUser as any)?.firstName.substring(0, 1)}
          {(params.row.productUser as any)?.lastName.substring(0, 1)}
        </div>
        {(params.row.productUser as any)?.firstName}{" "}
        {(params.row.productUser as any)?.lastName}
      </div>
    ),
  },
  {
    field: "date",
    headerName: "Event Date",
    type: "string",
    width: 180,
    valueGetter: (params) =>
      moment(params.row.timestamp).format("MMMM DD, YYYY"),
  },
];

function EventTable(props: EventTableProps) {
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const { loading, error, data } = useQuery<GetEvents, GetEventsVariables>(
    GET_EVENTS,
    {
      variables: {
        page,
        limit,
        ...props.variables,
      },
      onCompleted(data) {
        setRowCount(data.events.rows);
      },
    }
  );

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }
  return rowCount !== null ? (
    <Table
      rows={data ? data.events.nodes : []}
      columns={props.columns ?? EVENTS_TABLE_COLUMNS}
      pageSize={limit}
      page={page}
      onPageSizeChange={(param) => {
        setLimit(param.pageSize);
      }}
      rowCount={rowCount}
      onPageChange={(params) => {
        setPage(params.page);
      }}
      pagination
      paginationMode="server"
      loading={loading}
      shadow={true}
      autoHeight={true}
    ></Table>
  ) : (
    <CircularProgress />
  );
}

export default EventTable;
