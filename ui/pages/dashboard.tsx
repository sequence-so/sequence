import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { createGlobalState } from "react-hooks-global-state";
import DownArrow from "../public/down_arrow.svg";
import Logo from "../public/main_logo.svg";
import classnames from "classnames";
import BlueButton from "../components/BlueButton";

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
            <h1>Welcome to Hoco!</h1>
            <p>
              Hoco alerts you of important user behavior so you can convert your
              free trials more effectively.
            </p>
            <p>Setup is simple:</p>

            <div className={styles.row}>
              <div
                className={classnames(
                  styles.onboarding_box,
                  styles.onboarding_box_red
                )}
              >
                <div className={styles.onboarding_box_number}>1.</div>
                <div className={styles.onboarding_box_content}>
                  Connect to <br />
                  Your
                  <br /> Datasources
                </div>
              </div>
              <div
                className={classnames(
                  styles.onboarding_box,
                  styles.onboarding_box_blue
                )}
              >
                <div className={styles.onboarding_box_number}>2.</div>
                <div className={styles.onboarding_box_content}>
                  Configure <br />
                  Key Product <br />
                  Events
                </div>
              </div>
              <div
                className={classnames(
                  styles.onboarding_box,
                  styles.onboarding_box_purple
                )}
              >
                <div className={styles.onboarding_box_number}>3.</div>
                <div className={styles.onboarding_box_content}>
                  Create an
                  <br /> Alert and Be <br />
                  Notified
                </div>
              </div>
            </div>
            <BlueButton
              text={"Next"}
              onClick={(): void => {
                router.push("/onboarding/datasources");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
