import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import styles from "../../../styles/Home.module.css";
import { createGlobalState } from "react-hooks-global-state";
import DownArrow from "../../../public/down_arrow.svg";
import Logo from "../../../public/main_logo.svg";
import classnames from "classnames";
import BlueButton from "../../../components/BlueButton";
import Link from "next/link";
import AuthIntercom from "../../../components/AuthIntercom";

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

const IntercomPage = () => {
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
            <h1>Connect Intercom</h1>
            <AuthIntercom />

            <p className={styles.not_ready_text}>
              <Link href="/onboarding/datasources">
                <span className={styles.bold_text}>Go back</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntercomPage;
