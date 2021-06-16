import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AudienceIcon from "public/audience_icon.svg";
import { CircularProgress } from "@material-ui/core";
import RenderAudienceRules from "components/campaign/RenderAudienceRules";
import CommonSelect from "components/common/Select";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import ProductUserTable from "components/ProductUserTable";
import AudienceBuilder from "components/AudienceBuilder";
import {
  GET_AUDIENCES,
  GET_AUDIENCE_WITH_PRODUCT_USERS,
} from "components/audience/AudienceQueries";
import InspectorSidebarBase from "./InspectorSidebarBase";
import {
  GetAudiences,
  GetAudiences_audiences_nodes,
} from "__generated__/GetAudiences";
import GQLErrorMessage from "components/GQLErrorMessage";
import { Condition, deserialize } from "common/filters";
import styles from "../sidebar.module.css";
import {
  BaseAudienceCampaignNodeJson,
  CampaignAudienceRules,
} from "common/campaign";
import {
  GET_CAMPAIGNS_WITH_NODES,
  GET_CAMPAIGN_NODE_WITH_STATES,
  UPDATE_CAMPAIGN_NODE,
} from "components/campaign/CampaignQueries";
import {
  UpdateCampaignNode,
  UpdateCampaignNodeVariables,
} from "__generated__/UpdateCampaignNode";
import debounce from "lodash/debounce";
import AudienceCampaignNode from "common/campaign/nodes/audienceCampaignNode";
import { GetCampaignsWithNodes } from "__generated__/GetCampaignsWithNodes";
import { useRouter } from "next/router";
import { EditorContext } from "components/campaign/CampaignEditorGrid";
import {
  GetCampaignNodeWithStates,
  GetCampaignNodeWithStatesVariables,
} from "__generated__/GetCampaignNodeWithStates";
import AbstractCampaignNode from "campaign/nodes/abstractCampaignNode";

const generateAudienceList = (audiences: GetAudiences_audiences_nodes[]) => {
  return audiences.map((audience) => {
    return {
      value: audience.id,
      label: audience.name,
    };
  });
};

type Option = { label: string; value: string };

interface Props {
  node: AbstractCampaignNode;
}

const InspectorUsersTab = (props: Props) => {
  const context = useContext(EditorContext);
  const { data, loading, error } = useQuery<
    GetCampaignNodeWithStates,
    GetCampaignNodeWithStatesVariables
  >(GET_CAMPAIGN_NODE_WITH_STATES, {
    fetchPolicy: "no-cache",
    variables: {
      id: props.node.id,
    },
  });

  useEffect(() => {
    // getCampaignNodeStates();
  }, [props.node]);

  // const audienceCampaignNode = props.node;
  // const [onUpdateNode, setOnUpdateNode] = useState(0);
  // const [selected, setSelected] = useState<Option>(
  //   audienceCampaignNode.getAudienceId()
  //     ? {
  //         label: audienceCampaignNode.getAudienceName(),
  //         value: audienceCampaignNode.getAudienceId(),
  //       }
  //     : null
  // );
  // const [options, setOptions] = useState<Option[]>();
  // const [selectedAudienceRule, setSelectedAudienceRule] =
  //   useState<CampaignAudienceRules>(audienceCampaignNode.getAudienceRules());
  // const audienceNodeRef = useRef<Condition>();
  // const { data, loading, error } = useQuery<GetAudiences>(GET_AUDIENCES, {
  //   onCompleted(data) {
  //     setOptions(generateAudienceList(data.audiences.nodes));
  //   },
  // });
  // const [
  //   getAudienceWithProductUsers,
  //   { data: audienceData, loading: audienceLoading, error: audienceError },
  // ] = useLazyQuery(GET_AUDIENCE_WITH_PRODUCT_USERS);
  // const router = useRouter();
  // const [updateCampaignNode] = useMutation<
  //   UpdateCampaignNode,
  //   UpdateCampaignNodeVariables
  // >(UPDATE_CAMPAIGN_NODE, {
  //   update: (cache, mutationResult) => {
  //     const newCampaignNode = mutationResult.data.updateCampaignNode;
  //     const data = cache.readQuery<GetCampaignsWithNodes>({
  //       query: GET_CAMPAIGNS_WITH_NODES,
  //       variables: { id: router.query.id },
  //     });
  //     const index = data.campaigns.nodes[0].campaignNodes.findIndex(
  //       (node) => node.id === newCampaignNode.id
  //     );
  //     const nextCampaignNodes = [
  //       ...data.campaigns.nodes[0].campaignNodes,
  //     ].splice(index, 1, newCampaignNode);
  //     cache.writeQuery({
  //       query: GET_CAMPAIGNS_WITH_NODES,
  //       variables: { id: router.query.id },
  //       data: { campaigns: nextCampaignNodes },
  //     });
  //   },
  // });

  // const debouncedUpdate = useRef(
  //   debounce((values: UpdateCampaignNodeVariables) => {
  //     updateCampaignNode({
  //       variables: values,
  //     });
  //   }, 1000)
  // );

  // useEffect(() => {
  //   if (audienceCampaignNode.getAudienceId()) {
  //     getAudienceWithProductUsers({
  //       variables: {
  //         id: audienceCampaignNode.getAudienceId(),
  //       },
  //     });
  //   }
  // }, [audienceCampaignNode.getAudienceId()]);

  // const onChangeAudienceDropdown = useCallback(
  //   (option: Option) => {
  //     setSelected(option);
  //     const selectedAudience =
  //       data && data.audiences.nodes.find((o) => o.id === option.value);
  //     audienceCampaignNode.setAudienceId(option.value);
  //     audienceCampaignNode.setAudienceName(selectedAudience.name);
  //     audienceCampaignNode.setName(selectedAudience.name);
  //     debouncedUpdate.current({
  //       id: props.node.id,
  //       name: selectedAudience.name,
  //       json: {
  //         audienceId: option.value,
  //         audienceName: selectedAudience.name,
  //         audienceRules: selectedAudienceRule,
  //       } as BaseAudienceCampaignNodeJson,
  //     });
  //     context.onChangeNodeName(audienceCampaignNode);
  //   },
  //   [data, selectedAudienceRule]
  // );

  // const selectedAudience =
  //   data &&
  //   data.audiences.nodes.find(
  //     (o) => o.id === audienceCampaignNode.getAudienceId()
  //   );

  // useEffect(() => {
  //   if (selectedAudience && audienceData) {
  //     const parsedNode = JSON.parse(selectedAudience.node);
  //     const deserializedNode = deserialize(parsedNode);
  //     audienceNodeRef.current = deserializedNode;
  //     setOnUpdateNode((val) => val + 1);
  //   }
  // }, [selectedAudience, audienceData]);

  // const onSelectAudienceRule = useCallback(
  //   (rule: CampaignAudienceRules) => {
  //     setSelectedAudienceRule(rule);
  //     audienceCampaignNode.setAudienceRules(rule);
  //     debouncedUpdate.current({
  //       id: props.node.id,
  //       json: {
  //         audienceId: selected.value,
  //         audienceName: selectedAudience.name,
  //         audienceRules: rule,
  //       } as BaseAudienceCampaignNodeJson,
  //     });
  //   },
  //   [selected, selectedAudience]
  // );

  // useEffect(() => {
  //   return () => {
  //     debouncedUpdate.current.cancel();
  //   };
  // }, []);

  return (
    <InspectorSidebarBase
      icon={AudienceIcon}
      title={""}
      fillColor="#2074C5"
      placeholderTitle="Untitled Audience"
      subtitle="Use an existing Audience."
    >
      {data?.campaignNodes?.nodes?.map((e) => (
        <p>{JSON.stringify(e)}</p>
      ))}
    </InspectorSidebarBase>
  );
};

export default InspectorUsersTab;
