import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { createGlobalState } from "react-hooks-global-state";
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
      <p>
        {data.getUser.firstName} {data.getUser.lastName}
      </p>
    </div>
  );
  return (
    <h1>
      We are in the dashboard
      {loading ? <p>Loading...</p> : null}
      {error ? <p>{error}</p> : null}
      {RenderUser}
    </h1>
  );
};

export default Dashboard;
