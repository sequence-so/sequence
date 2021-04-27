import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import AlertRow from "../../components/AlertRow";
import { useRouter } from "next/router";
import { DataGrid, GridCellParams } from "@material-ui/data-grid";
import homeStyles from "../../styles/Home.module.css";
import moment from "moment";

const columns = [
  {
    field: "event_name",
    headerName: "Name",
    width: 200,
    renderCell: (params: GridCellParams) => (
      <div style={{ display: "inline-flex", alignItems: "center" }}>
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
        {params.getValue("event_name")}
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
          {params.getValue("firstName").toString().substring(0, 1)}
          {params.getValue("lastName").toString().substring(0, 1)}
        </div>
        {params.getValue("name")}
      </div>
    ),
  },
  {
    field: "date",
    headerName: "Date",
    type: "string",
    width: 180,
    valueGetter: (params) =>
      moment(params.getValue("signup_date")).format("MMMM DD, YYYY"),
  },
  {
    field: "source",
    headerName: "Source",
    description: "This column has a value getter and is not sortable.",
    width: 150,
  },
];

const AntTabs = withStyles({
  indicator: {
    backgroundColor: "#4E94E5",
    height: 5,
  },
  root: {
    alignSelf: "flex-start",
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: 16,
    marginRight: theme.spacing(4),
    color: "#222325",
    fontFamily: [
      "IBM Plex Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    textColorInherit: false,
    textColorPrimary: "#222325",
    wrapper: {
      color: "#222325",
    },
    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
    "&$selected": {
      color: "#4E94E5",
      fontWeight: theme.typography.fontWeightBold,
    },
    "&:focus": {
      color: "#40a9ff",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />) as typeof Tab;

const useStyles = makeStyles((theme) => ({
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
    alignItems: "flex-start",
  },
  demo2: {
    backgroundColor: "#2e1534",
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

const rows = [
  {
    id: 1,
    event_name: "User Signup",
    name: "Jon Snow",
    firstName: "Snow",
    lastName: "Jon",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: false,
    source: "Mobile",
  },
  {
    id: 2,
    event_name: "New Teammate Added",
    name: "Cersei Lannister",
    lastName: "Lannister",
    firstName: "Cersei",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
    source: "API",
  },
  {
    id: 3,
    event_name: "Invoice Paid",
    name: "Jaime Lannister",
    lastName: "Lannister",
    firstName: "Jaime",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
    source: "API",
  },
  {
    id: 4,
    event_name: "User Signup",
    name: "Arya Stark",
    lastName: "Stark",
    firstName: "Arya",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
    source: "Mobile",
  },
  {
    id: 5,
    event_name: "Webhook Processed",
    name: "Daenerys Targaryen",
    lastName: "Targaryen",
    firstName: "Daenerys",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
    source: "API",
  },
  {
    id: 6,
    event_name: "New Teammate Added",
    name: "Thomas Melisandre",
    lastName: "Melisandre",
    firstName: "Thomas",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
    source: "Mobile",
  },
  {
    id: 7,
    event_name: "Onboarding Clicked",
    name: "Ferrara Clifford",
    lastName: "Clifford",
    firstName: "Ferrara",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
    source: "Mobile",
  },
  {
    id: 8,
    event_name: "Integration Added",
    name: "Rossini Frances",
    lastName: "Frances",
    firstName: "Rossini",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: true,
    source: "Mobile",
  },
  {
    id: 9,
    event_name: "Integration Removed",
    name: "Harvey Roxie",
    lastName: "Roxie",
    firstName: "Harvey",
    signup_date: "2021-04-26T19:00:58.906Z",
    is_subscribed: false,
    source: "Mobile",
  },
];

const HistoryPage = () => {
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (router.pathname.indexOf("/alerts/history") > -1) {
      setValue(1);
    } else {
      setValue(0);
    }
  }, [router.isReady]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      router.push("/alerts/history");
    } else if (newValue === 0) {
      router.push("/alerts/");
    }
  };

  return (
    <DashboardLayout index={1}>
      <>
        <TitleBar
          title="My Alerts"
          subtitle="Manage your alerts and view your history."
        ></TitleBar>

        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="Alerts" />
          <AntTab label="History" />
        </AntTabs>
        <div style={{ marginTop: 8, height: 1 }}></div>
        <div
          style={{ display: "flex", width: "100%", flexDirection: "column" }}
        >
          {value === 0 ? (
            <>
              <AlertRow
                title="New Teammate Added"
                subtitle="Sends a Slack notification based on product activity."
                executions={3}
              />
              <AlertRow
                title="New Signup"
                subtitle="Sends a Slack notification based on product activity."
                executions={2}
              />
              <AlertRow
                title="Alert Created"
                subtitle="Sends a Slack notification based on product activity."
                executions={10}
              />
              <AlertRow
                title="Credit Card Added"
                subtitle="Sends a Slack notification based on product activity."
                executions={5}
              />
              <AlertRow
                title="Support Ticket Created"
                subtitle="Sends a Slack notification based on product activity."
                executions={8}
              />
            </>
          ) : (
            <div
              style={{
                height: "600px",
                width: "100%",
                marginTop: 8,
                paddingBottom: "2rem",
              }}
            >
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
          )}
        </div>
      </>
    </DashboardLayout>
  );
};

export default HistoryPage;
