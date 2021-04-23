import { useEffect, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../../styles/Home.module.css";
import { createGlobalState } from "react-hooks-global-state";
import DownArrow from "../../../public/down_arrow.svg";
import Logo from "../../../public/main_logo.svg";
import classnames from "classnames";
import BlueButton from "../../../components/BlueButton";
import { Formik, Field, ErrorMessage } from "formik";

const initialState = { token: "" };
const { useGlobalState } = createGlobalState(initialState);

const GET_USER = gql`
  {
    getUser {
      id
      firstName
      lastName
      email
      photo
    }
  }
`;

const GET_SEGMENT_WEBHOOK = gql`
  {
    getSegmentWebhook {
      id
      token
      receivedDataAt
    }
  }
`;

const CREATE_POSTGRES_DATABASE = gql`
  mutation CreatePostgresDatabase(
    $username: String
    $password: String
    $port: Int
    $hostname: String
    $schema: String
    $ssl: Boolean
  ) {
    createPostgresDatabase(
      password: $password
      username: $username
      port: $port
      hostname: $hostname
      schema: $schema
      ssl: $ssl
    ) {
      id
      username
      password
      port
      hostname
      schema
    }
  }
`;

const PostgresPage = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_USER);
  const [
    createPostgres,
    { data: dataPostgres, loading: loadingPostgres, error: errorPostgres },
  ] = useMutation(CREATE_POSTGRES_DATABASE);

  const RenderUser = data && (
    <div className={styles.profile}>
      <img
        className={styles.profile_image}
        width={30}
        height={30}
        src={data.getUser.photo}
      />
      <p>Hi, {data.getUser.firstName}</p>
      <img className={styles.profile_arrow} src={DownArrow} />
    </div>
  );
  return (
    <div className={styles.with_sidebar}>
      <div>
        <div className={styles.sidebar}>
          <img className={styles.sidebar_logo} src={Logo} />
          <div className={styles.sidebar_link}>Welcome</div>
          <div className={styles.sidebar_link_active}>Data Sources</div>
          <div className={styles.sidebar_link}>Create an Alert</div>
          <div className={styles.sidebar_link}>Done</div>
        </div>
        <div className={styles.container}>
          {RenderUser}
          <div
            className={classnames(
              styles.container_content,
              styles.segment_container_wrapper
            )}
          >
            <h1>Postgres Connection</h1>
            <p>Provides secure access to your Postgres database.</p>
            <div className={styles.form_box}>
              <Formik
                initialValues={{
                  hostname: "localhost",
                  username: "helson",
                  password: "",
                  port: "5432",
                  schema: "public",
                  ssl: "false",
                }}
                onSubmit={(values, { setSubmitting }): void => {
                  console.log({ values });
                  debugger;
                  values.port = parseInt(values.port) as any;
                  values.ssl = (values.ssl === "true") as any;
                  createPostgres({
                    variables: values,
                  })
                    .then(() => setSubmitting(false))
                    .catch(() => setSubmitting(false));
                }}
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
                  <form onSubmit={handleSubmit}>
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
                    <input
                      type="checkbox"
                      name="ssl"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.ssl}
                      style={{ display: "inline-flex" }}
                    ></input>
                    <label htmlFor="ssl" style={{ display: "inline-flex" }}>
                      Use SSL
                    </label>
                    {errorPostgres && (
                      <p style={{ color: "red" }}>{errorPostgres.message}</p>
                    )}
                    <BlueButton
                      type="submit"
                      text={
                        dataPostgres && dataPostgres.savePostgresDatabase
                          ? "Success"
                          : "Test Connection"
                      }
                      disabled={isSubmitting}
                      style={{ marginBottom: "0px" }}
                    />
                  </form>
                )}
              </Formik>
            </div>
            <p className={styles.not_ready_text}>
              <Link href="/onboarding/datasources">
                <>
                  Not ready?{" "}
                  <span className={styles.bold_text}>Click here to Skip</span>
                </>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostgresPage;
