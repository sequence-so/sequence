import { EditorStateEnum } from ".";
import AbstractEditorState from "./AbstractNodeState";
import MenuOptionsSidebar from "../sidebar/MenuOptionsSidebar";

class DefaultEditorState extends AbstractEditorState {
  kind = EditorStateEnum.Default;
  renderSidebar() {
    return <MenuOptionsSidebar />;
  }
}

export default DefaultEditorState;
