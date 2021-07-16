import { useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { GridColumns, GridRowParams } from "@material-ui/data-grid";
import classNames from "classnames";
import { useRouter } from "next/router";
import DashboardLayout from "layout/DashboardLayout";
import TitleBar from "layout/TitleBar";
import DefaultViewLayout from "layout/DefaultViewLayout";
import { PRODUCT_USER_COLUMN_MAPPING } from "components/productUser/columnMapping";
import { PAGE_DEFAULTS } from "constants/page";
import { GET_PRODUCT_USERS } from "components/explorer/ExplorerQueries";
import { GetProductUsers } from "__generated__/GetProductUsers";
import ServerPaginatedTable from "components/ServerPaginatedTable";

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
    "& .MuiDataGrid-row:hover": {
      cursor: "pointer",
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
  const router = useRouter();

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

  const onRowClick = (param: GridRowParams) => {
    router.push(`/explorer/${param.row.id}`);
  };

  return (
    <DashboardLayout index={2}>
      <>
        <TitleBar
          icon={PAGE_DEFAULTS.explorer.icon}
          title={PAGE_DEFAULTS.explorer.index.title}
          showAction={false}
          subtitle={PAGE_DEFAULTS.explorer.index.subtitle}
        ></TitleBar>
        <DefaultViewLayout>
          <ServerPaginatedTable<GetProductUsers>
            gql={GET_PRODUCT_USERS}
            queryOptions={{ fetchPolicy: "no-cache" }}
            shadow={true}
            getRows={(data) => data.productUsers.nodes}
            onRowClick={onRowClick}
            columns={PRODUCT_USER_COLUMN_MAPPING}
            components={components}
            componentsProps={componentsProp}
          />
        </DefaultViewLayout>
      </>
    </DashboardLayout>
  );
};

export default UserExplorerPage;
