import { useContext, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { Condition } from "common/filters";
import { CampaignAudienceRules } from "common/campaign";
import {
  GET_CAMPAIGNS_WITH_NODES,
  UPDATE_CAMPAIGN_NODE,
} from "components/campaign/CampaignQueries";
import {
  UpdateCampaignNode,
  UpdateCampaignNodeVariables,
} from "__generated__/UpdateCampaignNode";
import AudienceCampaignNode from "common/campaign/nodes/audienceCampaignNode";
import { GetCampaignsWithNodes } from "__generated__/GetCampaignsWithNodes";
import { EditorContext } from "components/campaign/CampaignEditorGrid";

interface Props {
  node: AudienceCampaignNode;
}

export const useAudienceCampaignNode = (props: Props) => {
  const context = useContext(EditorContext);
  const audienceCampaignNode = props.node;
  const [selectedAudienceRule, setSelectedAudienceRule] =
    useState<CampaignAudienceRules>(audienceCampaignNode.getAudienceRules());
  const audienceNodeRef = useRef<Condition>();

  const router = useRouter();
  const [updateCampaignNode] = useMutation<
    UpdateCampaignNode,
    UpdateCampaignNodeVariables
  >(UPDATE_CAMPAIGN_NODE, {
    update: (cache, mutationResult) => {
      const newCampaignNode = mutationResult.data.updateCampaignNode;
      const data = cache.readQuery<GetCampaignsWithNodes>({
        query: GET_CAMPAIGNS_WITH_NODES,
        variables: { id: router.query.id },
      });
      if (!data || !data.campaigns) {
        return;
      }
      const campaign = data.campaigns.nodes.find(
        (c) => c.id === context.campaignId
      );
      if (!campaign) {
        return;
      }
      const index = campaign.campaignNodes.findIndex(
        (node) => node.id === newCampaignNode.id
      );
      if (index === -1) {
        return;
      }
      const nextCampaignNodes = [...campaign.campaignNodes].splice(
        index,
        1,
        newCampaignNode
      );
      cache.writeQuery({
        query: GET_CAMPAIGNS_WITH_NODES,
        variables: { id: router.query.id },
        data: { campaigns: { campaignNodes: nextCampaignNodes } },
      });
    },
  });

  const debouncedUpdate = useRef(
    debounce((values: UpdateCampaignNodeVariables) => {
      updateCampaignNode({
        variables: values,
      });
    }, 1000)
  );

  return {
    updateCampaignNodeMutation: debouncedUpdate,
    selectedAudienceRule,
    setSelectedAudienceRule,
    audienceNodeRef,
  };
};
