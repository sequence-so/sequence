import TitleBar from "../../layout/TitleBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles, withStyles } from "@material-ui/core";
import { useState } from "react";
import SettingsLayout from "../../layout/SettingsLayout";

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

const SettingsPage = () => {
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <SettingsLayout index={5}>
      <>
        <TitleBar
          showAction={false}
          title="Settings"
          subtitle="Update your profile and configurations."
        ></TitleBar>

        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="Profile" />
          <AntTab label="Team" />
          <AntTab label="Notifications" />
        </AntTabs>
        <div style={{ marginTop: 8, height: 1 }}></div>
        <div
          style={{ display: "flex", width: "100%", flexDirection: "column" }}
        >
          <p>Not much happening here yet!</p>
        </div>
      </>
    </SettingsLayout>
  );
};

export default SettingsPage;
