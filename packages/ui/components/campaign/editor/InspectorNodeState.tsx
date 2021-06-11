import { EditorStateEnum } from ".";
import AbstractEditorState from "./AbstractNodeState";
import InspectorSidebar from "../sidebar/InspectorSidebar";
import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";

export enum InspectingNodeStateTab {
  Default = "Default",
  Users = "Users",
}

class InspectingNodeState extends AbstractEditorState {
  kind = EditorStateEnum.Inspecting;
  id: string;
  node: AbstractCampaignNode;
  tab = InspectingNodeStateTab.Default;
  constructor(node: AbstractCampaignNode, tab?: InspectingNodeStateTab) {
    super();
    this.node = node;
    this.tab = tab;
  }
  renderSidebar() {
    console.log(this.node);
    return (
      <InspectorSidebar
        key={this.node.id}
        reactFlowInstance={this.editorState.reactFlowInstance}
        node={this.node}
        editor={this.editorState}
        tab={this.tab}
      />
    );
  }
}

export default InspectingNodeState;
