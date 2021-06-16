import { gql, useMutation } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import CampaignEditor from "components/campaign/CampaignEditor";
import { useEffect } from "react";
import { GetCampaigns_campaigns_nodes } from "__generated__/GetCampaigns";
import DashboardLayout from "layout/DashboardLayout";
import { CREATE_CAMPAIGN } from "components/campaign/CampaignQueries";
import { CreateCampaign } from "__generated__/CreateCampaign";
import GQLErrorMessage from "components/GQLErrorMessage";
import { useRouter } from "next/router";

const CreateCampaignPage = () => {
  const [createCampaign, { data, loading, error }] =
    useMutation<CreateCampaign>(CREATE_CAMPAIGN);
  const router = useRouter();

  useEffect(() => {
    createCampaign({
      variables: {},
    }).then((value) => {
      router.push(`/campaigns/${value.data.createCampaign.id}`);
    });
  }, []);

  if (loading) {
    return <CircularProgress />;
  } else if (error) {
    return <GQLErrorMessage error={error.message} />;
  } else {
    return null;
  }
};
export default CreateCampaignPage;
