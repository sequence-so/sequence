import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import moment from "moment";
import {
  DataGrid,
  GridCellParams,
  GridColumns,
  GridPageChangeParams,
} from "@material-ui/data-grid";
import homeStyles from "../../styles/Home.module.css";
import gql from "graphql-tag";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import classNames from "classnames";
import DefaultViewLayout from "layout/DefaultViewLayout";
import { PRODUCT_USER_COLUMN_MAPPING } from "components/productUser/columnMapping";

export const GET_PRODUCT_USERS = gql`
  query GetProductUsers($page: Int, $limit: Int) {
    productUsers(page: $page, limit: $limit) {
      nodes {
        id
        firstName
        lastName
        email
        externalId
        createdAt
        updatedAt
      }
      page
      rows
    }
  }
`;

export interface ProductUser {
  id: string;
  email: string;
  distinctId: string;
  firstName: string;
  lastName: string;
  photo: string;
  phone: string;
  signedUpAt: Date;
  lastSeenAt: Date;
  intercomId: string;
  externalId: string;
  userId: string;
}
export interface GetProductUsers {
  productUsers: {
    nodes: ProductUser[];
    page: number;
    rows: number;
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
    margin: 0,
    marginBottom: 8,
    "& .MuiInputBase-root": {
      borderRadius: 7,
      width: "25ch",
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 6,
      border: "1px solid #C4C4C4",
      "& .Mui-focused": {
        border: "2px solid #3B6FAB",
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
      },
    },
    "& .MuiInputBase-root:hover": {
      border: "2px solid #4480C5",
      paddingTop: 3,
      paddingBottom: 3,
      paddingLeft: 5,
    },
    "& .MuiInputBase-input MuiInput-input": {
      borderRadius: 7,
      width: "25ch",
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 6,
      border: "1px solid #C4C4C4",
    },
  },
  input: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 0,
    fontFamily: "IBM Plex Sans",
    border: "none",
  },
  adornment: {
    color: "#A3A3A3",
  },
  table: {
    fontFamily: "IBM Plex Sans",
    "& .MuiDataGrid-colCell": {
      textTransform: "uppercase",
      color: "#4E4F55",
    },
    "& .MuiDataGrid-colCellRight": {
      border: "none",
    },
    "& .MuiTypography-body2": {
      fontFamily: "IBM Plex Sans",
    },
  },
  tableHeader: {
    textTransform: "uppercase",
    color: "white",
  },
}));

const columns = [
  {
    field: "full_name",
    headerName: "User",
    width: 200,
    renderCell: (params: GridCellParams) => (
      <Link href={`/explorer/${params.getValue("externalId")}`}>
        <a>
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <div className={homeStyles.initials_circle}>
              {(params.getValue("firstName") as any).substring(0, 1)}
              {(params.getValue("lastName") as any)?.substring(0, 1)}
            </div>
            {params.getValue("firstName") as any}{" "}
            {params.getValue("lastName") as any}
          </div>
        </a>
      </Link>
    ),
  },
];

const createColumnsFromData = (productUsers: ProductUser[]) => {
  const keys = Object.keys(productUsers[0]).filter(
    (key) => key !== "__typename"
  );
  let columnData: GridColumns = [];
  keys.map((key) => {
    columnData.push({
      field: key,
      width: 200,
      headerName: key,
    });
  });
  return columnData;
};

const SearchBar = () => {
  const classes = useStyles();

  return (
    <TextField
      className={classNames(classes.textField)}
      InputProps={{
        disableUnderline: true,
        inputProps: {
          className: classes.input,
          placeholder: "Search...",
        },
        startAdornment: (
          <InputAdornment position="start" className={classes.adornment}>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

const UserExplorerPage = () => {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [columnData, setColumnData] = useState<GridColumns>();
  const { loading, error, data } = useQuery<GetProductUsers>(
    GET_PRODUCT_USERS,
    {
      variables: {
        page,
        limit: 10,
      },
      onCompleted(data) {
        setRowCount(data.productUsers.rows);
      },
    }
  );
  const renderColumns = useMemo(() => {
    if (data?.productUsers.nodes) {
      setColumnData(PRODUCT_USER_COLUMN_MAPPING);
    }
  }, [data?.productUsers]);

  const components = useMemo(
    () => ({
      ColumnResizeIcon: () => null,
    }),
    []
  );

  const componentsProp = useMemo(
    () => ({
      header: {
        className: classes.tableHeader,
      },
    }),
    []
  );

  const onPageChange = useMemo(
    () => (params: GridPageChangeParams) => {
      setPage(params.page);
    },
    []
  );

  return (
    <DashboardLayout index={2}>
      <>
        <TitleBar
          title="User Explorer"
          showAction={false}
          subtitle="Filter and search through your user data."
        ></TitleBar>
        <DefaultViewLayout>
          <>
            {data?.productUsers?.nodes && rowCount > 0 && columnData.length && (
              <DataGrid
                rows={data?.productUsers?.nodes || []}
                columns={columnData}
                pageSize={10}
                page={page}
                rowCount={rowCount}
                className={classes.table}
                onPageChange={onPageChange}
                pagination
                paginationMode="server"
                loading={loading}
                components={components}
                componentsProps={componentsProp}
              />
            )}
          </>
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default UserExplorerPage;
