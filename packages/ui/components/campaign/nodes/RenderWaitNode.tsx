import RenderCampaignNode from "./RenderCampaignNode";
import WaitIcon from "public/wait_icon.svg";
import { RenderNodeProps } from "components/campaign/nodes/RenderTriggerNode";

const RenderWaitNode = (props: RenderNodeProps) => {
  return (
    <RenderCampaignNode
      title={"WAIT"}
      subtitle={"Delay for a set time"}
      icon={WaitIcon}
      fillColor={"#C38B63"}
      {...props}
    />
  );
};

export default RenderWaitNode;
