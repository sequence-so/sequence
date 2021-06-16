import { EditorStateEnum } from ".";
import EditorStateManager from "./EditorStateManager";

abstract class AbstractEditorState {
  abstract kind: EditorStateEnum;
  editorState: EditorStateManager;
  abstract renderSidebar(): JSX.Element;
}

export default AbstractEditorState;
