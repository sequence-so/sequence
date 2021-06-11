import { NodeElementType } from "../CampaignEditorGrid";
import RenderCampaignNode from "./RenderCampaignNode";
import TriggerIcon from "public/trigger_icon.svg";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface NodeProps {
  title: string;
  subtitle: string;
  icon: string;
  fillColor: string;
}

export interface RenderNodeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    Partial<Omit<NodeElementType, "id">> {
  id?: string;
  isGridNode: boolean;
}

const RenderTriggerNode = (props: RenderNodeProps) => {
  return (
    <RenderCampaignNode
      title={"TRIGGER"}
      subtitle={"Use a custom Audience"}
      icon={TriggerIcon}
      fillColor="#B536E1"
      {...props}
    />
  );
};

export default RenderTriggerNode;
