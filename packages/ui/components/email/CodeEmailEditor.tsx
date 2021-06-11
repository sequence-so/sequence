import React, { useCallback, useRef, useState } from "react";
import Monaco from "monaco-editor";
import MonacoEditor, { EditorProps, OnMount } from "@monaco-editor/react";
import {
  Toolbar,
  VariableButton,
  SwitchModesButton,
  VariablesMenu,
} from "./RichEmailEditor";

interface Props {
  html: string;
  onChange: (value: string) => void;
  onChangeModes: () => void;
}

const CodeEmailEditor = (props: Props) => {
  const [html, setHtml] = useState(props.html);
  const [anchorEl, setAnchorEl] = useState(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor>();
  const onClickVariableMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const onSelectVariable = (elem) => {
    const editor = editorRef.current;
    var selection = editor.getSelection();
    var id = { major: 1, minor: 1 };
    var text = `{{${elem.field}}}`;
    var op = {
      identifier: id,
      range: selection,
      text: text,
      forceMoveMarkers: true,
    };
    editor.executeEdits("my-source", [op]);
    setAnchorEl(null);
  };

  const onMount = useCallback<OnMount>((editor, monaco) => {
    editorRef.current = editor;
  }, []);

  return (
    <div className="container">
      <Toolbar>
        <VariableButton onClick={onClickVariableMenu} />
        <SwitchModesButton onClick={props.onChangeModes} />
      </Toolbar>
      <div className="editor">
        <MonacoEditor
          value={html}
          onChange={(newValue) => {
            setHtml(newValue);
            props.onChange(newValue);
          }}
          onMount={onMount}
          height="400px"
          defaultLanguage="html"
          language="sql"
          options={{
            minimap: { enabled: false },
            selectOnLineNumbers: false,
            cursorStyle: "line",
            wordWrapColumn: 60,
            wordWrap: "wordWrapColumn",
            // lineNumbers: "off",
            // glyphMargin: false,
            // folding: false,
            // // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
            // lineDecorationsWidth: 0,
            // lineNumbersMinChars: 0,
          }}
        />
      </div>
      <VariablesMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        onClickVariable={onSelectVariable}
      />
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
        }
        .editor {
          border: 1px solid #b6b6b8;
          border-radius: 4;
          padding-left: 14px;
          padding-right: 4px;
          min-height: 350;
        }
      `}</style>
    </div>
  );
};

export default CodeEmailEditor;
