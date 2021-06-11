import { useContext, useRef } from "react";
import debounce from "lodash/debounce";
import {
  UpdateCampaignNode,
  UpdateCampaignNodeVariables,
} from "__generated__/UpdateCampaignNode";
import { useMutation } from "@apollo/client";
import {
  GET_CAMPAIGNS_WITH_NODES,
  UPDATE_CAMPAIGN_NODE,
} from "components/campaign/CampaignQueries";
import { GetCampaignsWithNodes } from "__generated__/GetCampaignsWithNodes";
import { EditorContext } from "components/campaign/CampaignEditorGrid";
import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";

interface Props {
  campaignNode: AbstractCampaignNode;
}

export const useDebouncedCampaignNodeUpdate = (props: Props) => {
  const context = useContext(EditorContext);
  const [updateCampaignNode] = useMutation<
    UpdateCampaignNode,
    UpdateCampaignNodeVariables
  >(UPDATE_CAMPAIGN_NODE, {
    update: (cache, mutationResult) => {
      // const newCampaignNode = mutationResult.data.updateCampaignNode;
      // const data = cache.readQuery<GetCampaignsWithNodes>({
      //   query: GET_CAMPAIGNS_WITH_NODES,
      //   variables: { id: context.campaignId },
      // });
      // const campaign = data.campaigns.nodes.find(
      //   (c) => c.id === context.campaignId
      // );
      // if (!campaign) {
      //   return;
      // }
      // const index = campaign.campaignNodes.findIndex(
      //   (node) => node.id === newCampaignNode.id
      // );
      // const nextCampaignNodes = [...campaign.campaignNodes].splice(
      //   index,
      //   1,
      //   newCampaignNode
      // );
      // cache.writeQuery({
      //   query: GET_CAMPAIGNS_WITH_NODES,
      //   variables: { id: context.campaignId },
      //   data: { campaigns: { nodes: nextCampaignNodes } },
      // });
    },
  });

  const debouncedUpdate = useRef(
    debounce((values: Omit<UpdateCampaignNodeVariables, "id">) => {
      updateCampaignNode({
        variables: { ...values, id: props.campaignNode.id },
      });
    }, 1000)
  );

  return { update: debouncedUpdate };
};
