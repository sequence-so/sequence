import DashboardLayout, { useGlobalState } from "layout/DashboardLayout";
import CampaignEditor from "components/campaign/CampaignEditor";
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_CAMPAIGNS_WITH_NODES } from "components/campaign/CampaignQueries";
import { useRouter } from "next/router";
import { GetCampaignsWithNodes } from "__generated__/GetCampaignsWithNodes";
import { CircularProgress } from "@material-ui/core";
import GQLErrorMessage from "components/GQLErrorMessage";

const CampaignsIndexPage = () => {
  const router = useRouter();
  const [getCampaignsWithNodes, { data, loading, error }] =
    useLazyQuery<GetCampaignsWithNodes>(GET_CAMPAIGNS_WITH_NODES, {
      fetchPolicy: "no-cache",
    });
  const [_, setSidebarOpen] = useGlobalState("isSidebarOpen");
  useEffect(() => {
    if (router.isReady) {
      getCampaignsWithNodes({
        variables: {
          id: router.query.id,
        },
      });
    }
  }, [router.isReady]);

  // immediately close sidebar
  useEffect(() => {
    setSidebarOpen(false);
  }, []);
  const campaign = data?.campaigns?.nodes?.find(
    (o) => o.id === router.query.id
  );

  return (
    <DashboardLayout index={1} fullBleed={true} navbar={false}>
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {loading && <CircularProgress></CircularProgress>}
        {error && <GQLErrorMessage error={error.message} />}
        {!loading && !error && campaign && (
          <CampaignEditor
            key={router.query?.id as string}
            campaign={campaign}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CampaignsIndexPage;
