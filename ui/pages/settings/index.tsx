import DashboardLayout from "../../layout/DashboardLayout";
import TitleBar from "../../layout/TitleBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles, TextField, withStyles } from "@material-ui/core";
import { useState } from "react";
import { ErrorMessage, Formik } from "formik";
import BlueButton from "../../components/BlueButton";
import styles from "../../styles/Home.module.css";
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
          renderCreateAlert={false}
          title="Settings"
          subtitle="Change your stuff."
        ></TitleBar>

        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="Profile" />
          <AntTab label="Billing" />
          <AntTab label="Team" />
          <AntTab label="Notifications" />
        </AntTabs>
        <div style={{ marginTop: 8, height: 1 }}></div>
        <div
          style={{ display: "flex", width: "100%", flexDirection: "column" }}
        >
          {value === 0 ? (
            <>
              <p>My name here</p>
              <Formik
                initialValues={{
                  hostname: "",
                  username: "",
                  database: "",
                  password: "",
                  port: "5432",
                  schema: "public",
                  ssl: "false",
                }}
                onSubmit={(values, { setSubmitting }): void => {}}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  setSubmitting,
                }) => (
                  <form
                    className={styles.settings_form}
                    onSubmit={handleSubmit}
                  >
                    <label htmlFor="hostname">Hostname</label>
                    <input
                      type="hostname"
                      name="hostname"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.hostname}
                      placeholder="Hostname"
                    />
                    <ErrorMessage name="hostname" component="div" />

                    <label htmlFor="username">Username</label>
                    <input
                      type="username"
                      name="username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      placeholder="Username"
                    />
                    <ErrorMessage name="username" component="div" />
                    {errors.username && touched.username && errors.username}

                    <label htmlFor="username">Database</label>
                    <input
                      type="database"
                      name="database"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.database}
                      placeholder="database"
                    />
                    <ErrorMessage name="database" component="div" />
                    {errors.database && touched.database && errors.database}

                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      placeholder="Password"
                    />
                    {errors.password && touched.password && errors.password}
                    <label htmlFor="port">Port</label>
                    <input
                      type="port"
                      name="port"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.port}
                      placeholder="Port"
                    />
                    {errors.port && touched.port && errors.port}
                    <label htmlFor="schema">Schema</label>
                    <input
                      type="schema"
                      name="schema"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.schema}
                      placeholder="Schema"
                    />
                    {errors.schema && touched.schema && errors.schema}
                    <div
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        name="ssl"
                        onChange={(value) => {
                          handleChange("ssl")(
                            value.target.checked ? "true" : "false"
                          );
                        }}
                        onBlur={handleBlur}
                        value={values.ssl}
                        style={{ marginLeft: 4 }}
                      ></input>
                      <label htmlFor="ssl">Use SSL</label>
                    </div>
                    {/* {error && <p style={{ color: "red" }}>{error.message}</p>}
                    {dataPostgres && dataPostgres.createPostgresDatabase && (
                      <p>Successfully saved database</p>
                    )} */}
                    <BlueButton
                      type="submit"
                      text={"Save"}
                      style={{ marginBottom: "0px" }}
                    />
                  </form>
                )}
              </Formik>
            </>
          ) : (
            <>
              <h3>Billing</h3>
              <p>Manage your billing information and invoices</p>
              <hr></hr>
              <h4>Current plan</h4>
              <p>You are currently on the Free plan with 2 users.</p>
              <p>View plans and upgrade </p>
            </>
          )}
        </div>
      </>
    </SettingsLayout>
  );
};

export default SettingsPage;
