import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core";
import { useState } from "react";
import AlertRow from "../../components/AlertRow";

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
}))((props) => <Tab disableRipple {...props} />);

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <DashboardLayout index={0}>
      <>
        <TitleBar
          title="Integrations"
          subtitle="Update integrations."
        ></TitleBar>
      </>
    </DashboardLayout>
  );
};

export default Dashboard;
