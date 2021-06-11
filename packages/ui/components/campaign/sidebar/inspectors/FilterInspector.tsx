import React, { useCallback, useContext, useEffect, useState } from "react";
import InspectorSidebarBase from "../InspectorSidebarBase";
import styles from "../sidebar.module.css";
import FilterIcon from "public/filter_icon.svg";
import FilterCampaignNode from "common/campaign/nodes/filterCampaignNode";
import { useAudienceCampaignNode } from "hooks/useAudienceCampaignNode";
import AudienceBuilder from "components/AudienceBuilder";
import Select from "components/common/Select";
import { FilterCampaignNodeJson } from "common/campaign";
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
import { CircularProgress } from "@material-ui/core";
interface Props {
  node: FilterCampaignNode;
}

const DAYS_OPTIONS = [
  {
    label: "Immediately",
    value: `0`,
  },
  ...Array.from({ length: 30 }, (v, k) => ({
    label: k + 1 === 1 ? `1 day` : `${k + 1} days`,
    value: `${k + 1}`,
  })),
];

const getLabel = (days: number): Option => {
  if (days === 1) {
    return { label: `1 day`, value: `${1}` };
  }
  return { label: `${days} days`, value: `${days}` };
};

type Option = { label: string; value: string };

const FilterInspector = (props: Props) => {
  const context = useContext(EditorContext);
  const { audienceNodeRef, updateCampaignNodeMutation } =
    useAudienceCampaignNode(props);
  const [selectedWaitDays, setWaitDays] = useState<Option | null>(
    props.node.getWaitValue() ? getLabel(props.node.getWaitValue()) : null
  );
  const [title, setTitle] = useState<string>();
  const [errors, setErrors] = useState<NodeParseError[]>();
  const [audienceId, setAudienceId] = useState<string>();
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

  const onChangeTitleText = useCallback(
    (value: string) => {
      setTitle(value);
      props.node.setName(value);
      context.onChangeNodeName(props.node);
      updateCampaignNodeMutation.current({
        id: props.node.id,
        name: value,
        json: {
          waitValue: selectedWaitDays?.value
            ? parseInt(selectedWaitDays.value)
            : null,
          audienceId: props.node.getAudienceId(),
        } as FilterCampaignNodeJson,
      });
    },
    [selectedWaitDays]
  );

  const onChangeWaitValue = useCallback((value: Option) => {
    setWaitDays(value);
    const days = parseInt(value.value);
    updateCampaignNodeMutation.current({
      id: props.node.id,
      json: {
        waitValue: days,
        audienceId: props.node.getAudienceId(),
      } as FilterCampaignNodeJson,
    });

    props.node.setWaitValue(days);
  }, []);

  const onChangeAudience = useCallback(() => {
    const errors: NodeParseError[] = [];
    parse(audienceNodeRef.current, errors);
    if (errors.length) {
      setErrors(errors);
      return;
    }
    props.node.setFilter(audienceNodeRef.current);
    updateCampaignNodeMutation.current({
      id: props.node.id,
      json: {
        waitValue: selectedWaitDays?.value
          ? parseInt(selectedWaitDays.value)
          : null,
        audienceId: audienceId,
        audienceName: props.node.getAudienceName(),
      } as FilterCampaignNodeJson,
    });
    updateAudience({
      variables: {
        id: props.node.getAudienceId(),
        name: props.node.getAudienceName(),
        node: JSON.stringify(serialize(audienceNodeRef.current)),
      },
    });
  }, [audienceId, selectedWaitDays]);

  return (
    <InspectorSidebarBase
      icon={FilterIcon}
      title={title}
      onChangeTitleText={onChangeTitleText}
      placeholderTitle="Untitled Filter"
      fillColor="#E1D036"
      subtitle="Filter users from a previously executed step."
      horizontalScroll={true}
    >
      {!audienceNodeRef.current ? (
        <CircularProgress />
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
          <div className={styles.option_title}>WAIT FOR </div>
          <div>
            <Select
              value={selectedWaitDays}
              onChange={onChangeWaitValue}
              options={DAYS_OPTIONS}
            />
            <span>until a match is found before exiting the campaign.</span>
          </div>
        </>
      )}
    </InspectorSidebarBase>
  );
};

export default FilterInspector;
