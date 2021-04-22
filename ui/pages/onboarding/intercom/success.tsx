import { useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import styles from "../../../styles/Home.module.css";
import { createGlobalState } from "react-hooks-global-state";
import DownArrow from "../../../public/down_arrow.svg";
import Logo from "../../../public/main_logo.svg";
import classnames from "classnames";
import BlueButton from "../../../components/BlueButton";
import Link from "next/link";
import AuthIntercom from "../../../components/AuthIntercom";

const SAVE_INTERCOM = gql`
  mutation saveIntercom($code: String!) {
    saveIntercomCode(code: $code) {
      id
      isEnabled
    }
  }
`;

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

const IntercomSuccessPage = () => {
  const router = useRouter();
  const [saveIntercomCode] = useMutation(SAVE_INTERCOM);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const code = router.query.code;
    saveIntercomCode({
      variables: {
        code,
      },
    })
      .then((data) => {
        router.push("/onboarding/datasources");
      })
      .catch(console.error);
  }, [router.isReady]);
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

export default IntercomSuccessPage;
