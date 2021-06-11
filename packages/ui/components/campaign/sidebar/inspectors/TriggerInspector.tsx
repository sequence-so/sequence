import React, { useCallback, useContext, useEffect, useState } from "react";
import InspectorSidebarBase from "../InspectorSidebarBase";
import styles from "../sidebar.module.css";
import RenderAudienceRules from "components/campaign/RenderAudienceRules";
import { useAudienceCampaignNode } from "hooks/useAudienceCampaignNode";
import AudienceBuilder from "components/AudienceBuilder";
import {
  CampaignAudienceRules,
  FilterCampaignNodeJson,
  TriggerCampaignNodeJson,
} from "common/campaign";
import { EditorContext } from "components/campaign/CampaignEditorGrid";
import {
  Condition,
  deserialize,
  NodeParseError,
  parse,
  serialize,
} from "common/filters";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CREATE_AUDIENCE,
  GET_AUDIENCE_BY_ID,
  UPDATE_AUDIENCE,
} from "components/audience/AudienceQueries";
import {
  CreateAudience,
  CreateAudienceVariables,
} from "__generated__/CreateAudience";
import {
  GetAudienceById,
  GetAudienceByIdVariables,
} from "__generated__/GetAudienceById";
import {
  UpdateAudience,
  UpdateAudienceVariables,
} from "__generated__/UpdateAudience";
import TriggerIcon from "public/trigger_icon.svg";
import TriggerCampaignNode from "common/campaign/nodes/triggerCampaignNode";
import GQLErrorMessage from "components/GQLErrorMessage";
import { CircularProgress } from "@material-ui/core";

type Option = { label: string; value: string };

interface Props {
  node: TriggerCampaignNode;
}

const TriggerInspector = (props: Props) => {
  const context = useContext(EditorContext);
  const { audienceNodeRef, updateCampaignNodeMutation } =
    useAudienceCampaignNode(props);
  const [title, setTitle] = useState<string>();
  const [errors, setErrors] = useState<NodeParseError[]>([]);
  const [audienceId, setAudienceId] = useState<string>();
  const [selectedAudienceRule, setSelectedAudienceRule] =
    useState<CampaignAudienceRules>(props.node.getAudienceRules());
  const [createAudience] = useMutation<CreateAudience, CreateAudienceVariables>(
    CREATE_AUDIENCE,
    {
      onCompleted(data) {
        props.node.setAudienceId(data.createAudience.id);
        props.node.setAudienceName(data.createAudience.name);
        setAudienceId(data.createAudience.id);
        updateCampaignNodeMutation.current({
          id: props.node.id,
          json: {
            audienceId: data.createAudience.id,
          } as FilterCampaignNodeJson,
        });
      },
    }
  );
  const [getAudience] = useLazyQuery<GetAudienceById, GetAudienceByIdVariables>(
    GET_AUDIENCE_BY_ID,
    {
      onCompleted(data) {
        setAudienceId(props.node.getAudienceId());
        setTitle(props.node.getName());
        const parsedNode = JSON.parse(data.audiences.nodes[0].node);
        const deserializedNode = deserialize(parsedNode);
        audienceNodeRef.current = deserializedNode;
      },
    }
  );
  const [updateAudience] = useMutation<UpdateAudience, UpdateAudienceVariables>(
    UPDATE_AUDIENCE
  );

  useEffect(() => {
    if (props.node.getAudienceId()) {
      getAudience({
        variables: {
          id: props.node.getAudienceId(),
          localTo: "campaigns",
        },
      });
    } else {
      audienceNodeRef.current = Condition.and();
      createAudience({
        variables: {
          name: "",
          localTo: "campaigns",
          node: JSON.stringify(serialize(audienceNodeRef.current)),
        },
      });
    }
  }, [props.node.getAudienceId()]);

  const onChangeTitleText = useCallback((value: string) => {
    setTitle(value);
    props.node.setName(value);
    props.node.setAudienceName(value);
    context.onChangeNodeName(props.node);
    updateCampaignNodeMutation.current({
      id: props.node.id,
      name: value,
      json: {
        audienceId: props.node.getAudienceId(),
        audienceName: value,
        audienceRules: selectedAudienceRule,
      } as TriggerCampaignNodeJson,
    });
  }, []);

  const onSelectAudienceRule = useCallback((rule: CampaignAudienceRules) => {
    setSelectedAudienceRule(rule);
    props.node.setAudienceRules(rule);
    updateCampaignNodeMutation.current({
      id: props.node.id,
      json: {
        audienceId: props.node.getAudienceId(),
        audienceName: props.node.getAudienceName(),
        audienceRules: rule,
      } as TriggerCampaignNodeJson,
    });
  }, []);

  const onChangeAudience = useCallback(() => {
    const errors: NodeParseError[] = [];
    parse(audienceNodeRef.current, errors);
    if (errors.length) {
      setErrors(errors);
      return;
    }
    console.log(JSON.stringify(serialize(audienceNodeRef.current)));
    props.node.setFilter(audienceNodeRef.current);
    updateCampaignNodeMutation.current({
      id: props.node.id,
      json: {
        audienceId: audienceId,
        audienceName: props.node.getAudienceName(),
        audienceRules: selectedAudienceRule,
      } as TriggerCampaignNodeJson,
    });
    updateAudience({
      variables: {
        id: props.node.getAudienceId(),
        name: props.node.getAudienceName(),
        node: JSON.stringify(serialize(audienceNodeRef.current)),
      },
    });
  }, [audienceId]);

  return (
    <InspectorSidebarBase
      icon={TriggerIcon}
      title={title}
      onChangeTitleText={onChangeTitleText}
      placeholderTitle="Untitled Trigger"
      fillColor="#B536E1"
      subtitle="Users that match these criteria will enter this campaign."
      horizontalScroll={true}
    >
      {!audienceNodeRef.current ? (
        <CircularProgress></CircularProgress>
      ) : (
        <>
          <div
            className={styles.option_title}
            style={{ marginBlockStart: "1em" }}
          >
            AUDIENCE RULES
          </div>
          <AudienceBuilder
            renderTitle={false}
            renderQueryButton={false}
            name={title}
            rootNode={audienceNodeRef.current}
            onChange={onChangeAudience}
            validateOnBlur={true}
          />
          <div className={styles.option_title}>APPLY RULES TO</div>
          <RenderAudienceRules
            onClick={onSelectAudienceRule}
            selected={selectedAudienceRule}
          />
        </>
      )}
    </InspectorSidebarBase>
  );
};

export default TriggerInspector;
