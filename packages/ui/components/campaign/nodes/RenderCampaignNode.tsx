import { DetailedHTMLProps, HTMLAttributes } from "react";
import GridNode from "./GridNode";
import { NodeElementType } from "../CampaignEditorGrid";
import RenderBaseNode from "./RenderBaseNode";

export interface RenderCampaignNodeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    Partial<Omit<NodeElementType, "id">> {
  id?: string;
  isGridNode: boolean;
  title: string;
  subtitle: string;
  icon: string;
  fillColor: string;
  selected?: boolean;
}

const RenderCampaignNode = (props: RenderCampaignNodeProps) => {
  const baseNode = <RenderBaseNode {...props} />;
  if (props.id) {
    return <GridNode {...props}>{baseNode}</GridNode>;
  } else {
    return baseNode;
  }
};

export default RenderCampaignNode;
