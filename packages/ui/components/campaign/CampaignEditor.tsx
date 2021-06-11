import { useRef } from "react";
import { GetCampaignsWithNodes_campaigns_nodes } from "__generated__/GetCampaignsWithNodes";
import CampaignEditorGrid from "./CampaignEditorGrid";
import EditorStateManager from "./editor/EditorStateManager";

interface Props {
  campaign?: GetCampaignsWithNodes_campaigns_nodes;
}

const CampaignEditor = (props: Props) => {
  const editorStateRef = useRef<EditorStateManager>(
    new EditorStateManager(props.campaign)
  );
  return <CampaignEditorGrid editorState={editorStateRef.current} />;
};

export default CampaignEditor;
