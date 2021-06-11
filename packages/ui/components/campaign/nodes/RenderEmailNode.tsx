import RenderCampaignNode from "./RenderCampaignNode";
import EmailIcon from "public/email_icon.svg";
import { RenderNodeProps } from "components/campaign/nodes/RenderTriggerNode";

const RenderEmailNode = (props: RenderNodeProps) => {
  return (
    <RenderCampaignNode
      title={"EMAIL"}
      subtitle={"Send an email"}
      icon={EmailIcon}
      fillColor="#F24A4A"
      {...props}
    />
  );
};

export default RenderEmailNode;
