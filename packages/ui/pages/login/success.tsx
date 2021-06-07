import { useRouter } from "next/router";
import { useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
const initialState = { token: "" };
const { useGlobalState } = createGlobalState(initialState);

const Success = () => {
  const router = useRouter();
  const [token, setToken] = useGlobalState("token");

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (!router.query.token) {
      router.push("/");
      return;
    }
    localStorage.token = router.query.token;
    setToken(router.query.token as string);
    router.push("/blasts");
  }, [router.isReady]);

  return <div></div>;
};

export default Success;
