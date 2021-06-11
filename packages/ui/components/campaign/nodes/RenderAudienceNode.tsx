import RenderCampaignNode from "./RenderCampaignNode";
import AudienceIcon from "public/audience_icon.svg";
import { RenderNodeProps } from "components/campaign/nodes/RenderTriggerNode";

const RenderAudienceNode = (props: RenderNodeProps) => {
  return (
    <RenderCampaignNode
      title={"AUDIENCE"}
      subtitle={"Use an existing Audience"}
      icon={AudienceIcon}
      fillColor="#2074C5"
      {...props}
    />
  );
};

export default RenderAudienceNode;
