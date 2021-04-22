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
    if (!router.query.code) {
      router.push("/");
      return;
    }
    localStorage.token = router.query.code;
    setToken(router.query.code as string);
    // TODO: save intercom code via mutation
    router.push("/dashboard");
  }, [router.isReady]);

  return <div></div>;
};

export default Success;
