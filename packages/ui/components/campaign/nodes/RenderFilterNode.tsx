import RenderCampaignNode from "./RenderCampaignNode";
import FilterIcon from "public/filter_icon.svg";
import { RenderNodeProps } from "components/campaign/nodes/RenderTriggerNode";

const RenderFilterNode = (props: RenderNodeProps) => {
  return (
    <RenderCampaignNode
      title={"FILTER"}
      subtitle={"Apply Audience rules"}
      icon={FilterIcon}
      fillColor="#E1D036"
      {...props}
    />
  );
};

export default RenderFilterNode;
