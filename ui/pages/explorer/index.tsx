import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import Tabs from "@material-ui/core/Tabs";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import moment from "moment";
import { DataGrid, GridCellParams } from "@material-ui/data-grid";
import homeStyles from "../../styles/Home.module.css";

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
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "full_name",
    headerName: "Name",
    width: 200,
    renderCell: (params: GridCellParams) => (
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <div className={homeStyles.initials_circle}>
          {params.getValue("firstName").toString().substring(0, 1)}
          {params.getValue("lastName").toString().substring(0, 1)}
        </div>
        {params.getValue("name")}
      </div>
    ),
  },
  {
    field: "signup",
    headerName: "Signup Date",
    type: "string",
    width: 180,
    valueGetter: (params) =>
      moment(params.getValue("signup_date")).format("MMMM DD, YYYY"),
  },
  {
    field: "paying_user",
    headerName: "Paying User",
    description: "This column has a value getter and is not sortable.",
    width: 150,
    valueGetter: (params) => (params.getValue("is_subscribed") ? "Yes" : "No"),
  },
  {
    field: "render_source",
    headerName: "Source",
    description: "This column has a value getter and is not sortable.",
    width: 150,
    valueGetter: (params) => "Mobile",
  },
];

const rows = [
  {
    id: 1,
    name: "Snow Jon",
    firstName: "Snow",
    lastName: "Jon",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: false,
  },
  {
    id: 2,
    name: "Cersei Lannister",
    lastName: "Lannister",
    firstName: "Cersei",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
  },
  {
    id: 3,
    name: "Jaime Lannister",
    lastName: "Lannister",
    firstName: "Jaime",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
  },
  {
    id: 4,
    name: "Arya Stark",
    lastName: "Stark",
    firstName: "Arya",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    lastName: "Targaryen",
    firstName: "Daenerys",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
  },
  {
    id: 6,
    name: "Thomas Melisandre",
    lastName: "Melisandre",
    firstName: "Thomas",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
  },
  {
    id: 7,
    name: "Ferrara Clifford",
    lastName: "Clifford",
    firstName: "Ferrara",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
  },
  {
    id: 8,
    name: "Rossini Frances",
    lastName: "Frances",
    firstName: "Rossini",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
  },
  {
    id: 9,
    name: "Harvey Roxie",
    lastName: "Roxie",
    firstName: "Harvey",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: false,
  },
];

const UserExplorerPage = () => {
  const classes = useStyles();

  return (
    <DashboardLayout index={0}>
      <>
        <TitleBar title="User Explorer" subtitle="View your users."></TitleBar>
        <div
          style={{
            height: "600px",
            width: "100%",
            marginTop: 8,
            paddingBottom: "2rem",
          }}
        >
          <TextField
            className={clsx(classes.textField)}
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
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            className={classes.table}
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
      </>
    </DashboardLayout>
  );
};

export default UserExplorerPage;
