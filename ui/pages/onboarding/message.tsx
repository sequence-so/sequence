import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import onboardingStyles from "./onboarding.module.css";
import { createGlobalState } from "react-hooks-global-state";
import DownArrow from "../../public/down_arrow.svg";
import Logo from "../../public/main_logo.svg";
import classnames from "classnames";
import BlueButton from "../../components/BlueButton";
import Link from "next/link";
import LogoSquare from "../../public/logo_square.svg";

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
      segment
      postgres
    }
  }
`;

const MessagePage = () => {
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
            <h1>Configure the Message</h1>
            <p>Customize your message by editing the text below.</p>

            <div className={onboardingStyles.message_well}>
              <div className={onboardingStyles.message_well_inner}>
                <img src={LogoSquare} />
                <div className={onboardingStyles.message_well_right}>
                  <div className={onboardingStyles.message_title}>
                    <p
                      style={{
                        color: "#1D1C1D",
                        fontWeight: "bold",
                      }}
                    >
                      Tooldash
                    </p>
                    <p className={onboardingStyles.message_app_bubble}>APP</p>
                    <p className={onboardingStyles.message_title}>6:48 PM</p>
                  </div>
                  <div
                    className={onboardingStyles.message_text_area}
                    contentEditable={true}
                  >
                    We’ve detected a change in one of your metrics for user_id
                    13349 from <b>{"{{ old_value }}"}</b> to{" "}
                    <b>{"{{ new_value }}"}</b>.
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <BlueButton
                  text="Next"
                  onClick={(): void => {
                    router.push("/onboarding/done");
                  }}
                  style={{ marginRight: 0, marginTop: 10, marginBottom: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
