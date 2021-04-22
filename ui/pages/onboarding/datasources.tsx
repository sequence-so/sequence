import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import { createGlobalState } from "react-hooks-global-state";
import DownArrow from "../../public/down_arrow.svg";
import Logo from "../../public/main_logo.svg";
import classnames from "classnames";
import BlueButton from "../../components/BlueButton";
import Link from "next/link";
import GreenCheckmark from "../../public/green_check.svg";

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

const GET_INTEGRATIONS = gql`
  {
    getIntegrations {
      intercom
    }
  }
`;

const Dashboard = () => {
  const [token, setToken] = useGlobalState("token");
  const router = useRouter();
  useEffect(() => {
    if (localStorage && localStorage.token) {
      setToken(localStorage.token);
      return;
    }
    if (!token) {
      router.push("/");
    }
  }, []);
  const { loading, error, data } = useQuery(GET_USER);
  const {
    loading: loadingIntegrations,
    error: errorIntegrations,
    data: integrations,
  } = useQuery(GET_INTEGRATIONS);

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
          <div className={styles.sidebar_link_active}>Welcome</div>
          <div className={styles.sidebar_link}>Data Sources</div>
          <div className={styles.sidebar_link}>Create an Alert</div>
          <div className={styles.sidebar_link}>Done</div>
        </div>
        <div className={styles.container}>
          {RenderUser}
          <div className={styles.container_content}>
            <h1>Integrations</h1>
            <p>Click to setup your first integration.</p>

            <div className={styles.integrations_grid}>
              <div className={styles.integration_box}>Postgres</div>
              <Link href="/onboarding/segment">
                <div className={styles.integration_box}>Segment</div>
              </Link>

              {integrations && integrations.getIntegrations.intercom && (
                <div className={styles.integration_box_done}>
                  <img src={GreenCheckmark} />
                  Intercom
                </div>
              )}
              {integrations && !integrations.getIntegrations.intercom && (
                <Link href="/onboarding/intercom">
                  <div className={styles.integration_box}>Intercom</div>
                </Link>
              )}
            </div>

            <p className={styles.not_ready_text}>
              Not ready?{" "}
              <Link href="/onboarding/done">
                <span className={styles.bold_text}>Click here to Skip</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
