import { useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import OnboardingLayout from "../../../layout/OnboardingLayout";
import { CircularProgress } from "@material-ui/core";

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
        router.push("/onboarding/integrations");
      })
      .catch(console.error);
  }, [router.isReady]);
  const { loading, error, data } = useQuery(GET_USER);

  return (
    <OnboardingLayout index={1}>
      <>
        <h1>Connect Intercom</h1>
        <p>Saving Intercom data...</p>
        <CircularProgress></CircularProgress>
      </>
    </OnboardingLayout>
  );
};

export default IntercomSuccessPage;
