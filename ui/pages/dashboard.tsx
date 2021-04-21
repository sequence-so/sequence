import { useRouter } from "next/router";
import { useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
const initialState = { token: "" };
const { useGlobalState } = createGlobalState(initialState);

const Dashboard = () => {
  const [token, setToken] = useGlobalState("token");
  const router = useRouter();
  useEffect(() => {
    if (localStorage.token) {
      setToken(localStorage.token);
      return;
    }
    if (!token) {
      router.push("/");
    }
  }, []);

  return <h1>We are in the dashboard</h1>;
};

export default Dashboard;
