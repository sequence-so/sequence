import { useRouter } from "next/router";
import { useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
const initialState = { token: "" };
const { useGlobalState } = createGlobalState(initialState);

export const GET_USER_WITH_ONBOARDING = `
  query GetUser {
    getUser {
      id
      firstName
      lastName
      onboardedAt
    }
  }
`;

export async function getServerSideProps(context) {
  const url = context.req.url as string;
  const index = url.indexOf("?token=");
  const token = url.substring(index + "?token=".length, url.length);
  let apiEndpoint = `${
    process.env.NEXT_PRIVATE_API_URL || process.env.NEXT_PUBLIC_API_URL
  }/graphql`;
  const res = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: GET_USER_WITH_ONBOARDING }),
  }).then((r) => r.json());

  console.log(res);
  const onboardedAt = res.data.getUser.onboardedAt;

  if (!res) {
    return {
      props: {
        onboardedAt: null,
      },
    };
  }

  return {
    props: {
      onboardedAt: onboardedAt,
    },
  };
}

interface Props {
  onboardedAt: Date;
}

const Success = (props: Props) => {
  console.log(props);
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
    if (props.onboardedAt) {
      router.push("/blasts");
    } else {
      router.push("/onboarding");
    }
  }, [router.isReady]);

  return <div></div>;
};

export default Success;
