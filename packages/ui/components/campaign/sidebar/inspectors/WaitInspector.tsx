import React, { useCallback, useContext, useState } from "react";
import InspectorSidebarBase from "../InspectorSidebarBase";
import styles from "../sidebar.module.css";
import Select from "components/common/Select";
import WaitIcon from "public/wait_icon.svg";
import WaitCampaignNode from "common/campaign/nodes/waitCampaignNode";
import { useDebouncedCampaignNodeUpdate } from "hooks/useDebouncedCampaignNodeUpdate";
import { WaitCampaignNodeJson } from "common/campaign";
import { EditorContext } from "components/campaign/CampaignEditorGrid";

interface Props {
  node: WaitCampaignNode;
}

const DAYS_OPTIONS = [
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

const WaitInspector = (props: Props) => {
  const context = useContext(EditorContext);
  const waitCampaignNode = props.node;
  const { update: updateMutation } = useDebouncedCampaignNodeUpdate({
    campaignNode: props.node,
  });
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    waitCampaignNode.getDays() ? getLabel(waitCampaignNode.getDays()) : null
  );

  const onChangeWaitValue = useCallback((value: Option) => {
    setSelectedOption(value);
    const days = parseInt(value.value);
    updateMutation.current({
      name: value.label,
      json: {
        days,
      } as WaitCampaignNodeJson,
    });
    waitCampaignNode.setDays(days);
    waitCampaignNode.setName(value.label);
    context.onChangeNodeName(waitCampaignNode);
  }, []);

  return (
    <InspectorSidebarBase
      icon={WaitIcon}
      fillColor="#C38B63"
      title={"Wait"}
      subtitle="Wait for a specified amount of time."
      regularSize={true}
    >
      <div className={styles.option_title} style={{ marginBlockStart: "1em" }}>
        WAIT FOR{" "}
      </div>
      <div>
        <Select
          value={selectedOption}
          onChange={onChangeWaitValue}
          options={DAYS_OPTIONS}
          placeholder="Number of days..."
        />
        <span>before moving onto the next step.</span>
      </div>
    </InspectorSidebarBase>
  );
};

export default WaitInspector;
