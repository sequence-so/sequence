import { DataGrid, GridCellParams } from "@material-ui/data-grid";
import { useStyles } from "./AudienceBuilder";
import homeStyles from "styles/Home.module.css";
import { Link } from "@material-ui/core";
import moment from "moment";

export const columns = [
  {
    field: "full_name",
    headerName: "User",
    width: 200,
    renderCell: (params: GridCellParams) => (
      <Link href={`/explorer/${params.row.id}`}>
        <a>
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <div className={homeStyles.initials_circle}>
              {(params.row.firstName as any).substring(0, 1)}
              {(params.row.lastName as any)?.substring(0, 1)}
            </div>
            {params.row.firstName as any} {params.row.lastName as any}
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
      moment(params.row.createdAt).format("MMMM DD, YYYY"),
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

const PeopleTable = ({ productUsers, rows }) => {
  const classes = useStyles();

  return (
    <div style={{ height: 700, width: "100%" }}>
      <DataGrid
        rows={productUsers || []}
        columns={columns}
        pageSize={10}
        page={0}
        rowCount={rows}
        className={classes.table}
        pagination
        components={{
          ColumnResizeIcon: () => null,
        }}
        componentsProps={{
          header: {
            className: classes.tableHeader,
          },
        }}
      />
    </div>
  );
};

export default PeopleTable;
