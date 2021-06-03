import { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import OnboardingLayout from "../../../layout/OnboardingLayout";
import { CircularProgress } from "@material-ui/core";

const SAVE_DISCORD = gql`
  mutation saveDiscordCode($code: String!) {
    saveDiscordCode(code: $code) {
      id
      userId
      webhookId
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

const DiscordSuccessPage = () => {
  const router = useRouter();
  const [saveDiscordCode] = useMutation(SAVE_DISCORD);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const code = router.query.code;
    saveDiscordCode({
      variables: {
        code,
      },
    })
      .then((data) => {
        router.push("/onboarding/integrations");
      })
      .catch(console.error);
  }, [router.isReady]);

  return (
    <OnboardingLayout index={1}>
      <>
        <h1>Connecting Discord</h1>
        <p>Saving Discord data...</p>
        <CircularProgress></CircularProgress>
      </>
    </OnboardingLayout>
  );
};

export default DiscordSuccessPage;
