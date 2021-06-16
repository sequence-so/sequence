import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";
import { EditorStateEnum } from ".";
import AbstractEditorState from "./AbstractNodeState";

class ConnectingNodesEditorState extends AbstractEditorState {
  kind = EditorStateEnum.Connecting;
  from?: AbstractCampaignNode;
  to?: AbstractCampaignNode;
  valid: boolean;
  renderSidebar() {
    return null;
  }
}

export default ConnectingNodesEditorState;
