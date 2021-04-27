import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import AlertRow from "../../components/AlertRow";
import { useRouter } from "next/router";

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
  root: {
    flexGrow: 1,
  },
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
}));

const Dashboard = () => {
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
    console.log(newValue);
  };

  return (
    <DashboardLayout index={0}>
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
            <p>Other page</p>
          )}
        </div>
      </>
    </DashboardLayout>
  );
};

export default Dashboard;
