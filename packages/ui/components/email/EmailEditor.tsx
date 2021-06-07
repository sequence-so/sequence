import { useEffect, useRef, useState } from "react";
import MEditor from "@monaco-editor/react";
import EmailRenderer from "./EmailRenderer";
import { EmailType } from "pages/emails/[id]";
import EmailTextArea from "./EmailTextArea";
import CreateInput from "components/common/CreateInput";
import { gql, useMutation } from "@apollo/client";
import { CircularProgress, Input, TextField } from "@material-ui/core";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import styles from "styles/Home.module.css";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CREATE_EMAIL = gql`
  mutation CreateEmail(
    $name: String
    $bodyHtml: String
    $bodyText: String
    $subject: String
    $from: String
    $fromName: String
  ) {
    createEmail(
      name: $name
      bodyHtml: $bodyHtml
      bodyText: $bodyText
      subject: $subject
      from: $from
      fromName: $fromName
    ) {
      id
      bodyHtml
    }
  }
`;
const UPDATE_EMAIL = gql`
  mutation UpdateEmail(
    $id: ID!
    $name: String
    $bodyHtml: String
    $bodyText: String
    $subject: String
    $from: String
    $fromName: String
  ) {
    updateEmail(
      id: $id
      name: $name
      bodyHtml: $bodyHtml
      bodyText: $bodyText
      subject: $subject
      from: $from
      fromName: $fromName
    ) {
      id
      bodyHtml
    }
  }
`;

const DELETE_EMAIL = gql`
  mutation DeleteEmail($id: ID!) {
    deleteEmail(id: $id) {
      success
    }
  }
`;

interface EmailEditorInnerProps {
  email: EmailType;
  name: string;
  onChangeName: (text: string) => void;
}

const EmailEditorInner = (props: EmailEditorInnerProps) => {
  const router = useRouter();
  const [updateEmail, { error: updateEmailError }] = useMutation(UPDATE_EMAIL);
  const [deleteEmail] = useMutation(DELETE_EMAIL, {
    onCompleted() {
      router.push("/emails");
    },
  });
  const [renderState, setRenderState] = useState<"rich" | "code">("rich");
  const [html, setHtml] = useState<string>(props.email?.bodyHtml || "");
  const [subject, setSubject] = useState(props.email?.subject || "");
  const [emailName, setEmailName] = useState(props.name || "");
  const updateFunc = (values: any) => updateEmail(values);
  const debouncedUpdate = useRef<any>(
    debounce((values) => {
      updateFunc(values);
    }, 1000)
  );
  useEffect(() => {
    if (props.name !== emailName) {
      setEmailName(props.name);
      debouncedUpdate.current({
        variables: {
          id: props.email.id,
          name: props.name,
          bodyHtml: html,
          bodyText: "",
          from: "helson@sequence.so",
          fromName: "Helson",
          subject,
        },
      });
    }
  }, [props.name]);

  const onDeleteEmail = () => {
    deleteEmail({
      variables: {
        id: props.email.id,
      },
    });
  };

  useEffect(() => {
    return () => {
      debouncedUpdate.current.cancel();
    };
  }, []);

  return (
    <>
      <div className={"wrapper"}>
        <div className={"editor_wrapper"}>
          <div className="editor-text-area">
            <p style={{ fontWeight: 500, marginBlockEnd: 14 }}>Subject:</p>
            <CreateInput
              defaultValue={subject}
              placeholder="Subject"
              onChangeText={(value) => {
                setSubject(value);
                debouncedUpdate.current({
                  variables: {
                    id: props.email.id,
                    name: emailName,
                    bodyHtml: html,
                    bodyText: "",
                    from: "helson@sequence.so",
                    fromName: "Helson",
                    subject: value,
                  },
                });
              }}
              style={{ marginBottom: 14, width: "100%" }}
            ></CreateInput>
            {renderState === "rich" && (
              <EmailTextArea
                value={html}
                onChange={(text) => {
                  setHtml(text);
                  debouncedUpdate.current({
                    variables: {
                      id: props.email.id,
                      name: emailName,
                      bodyHtml: text,
                      bodyText: "",
                      from: "helson@sequence.so",
                      fromName: "Helson",
                      subject,
                    },
                  });
                }}
              />
            )}
            {renderState === "code" && (
              <MEditor
                value={html}
                onChange={(newValue) => {
                  setHtml(newValue);
                  debouncedUpdate.current({
                    variables: {
                      id: props.email.id,
                      name: emailName,
                      bodyHtml: newValue,
                      bodyText: "",
                      from: "helson@sequence.so",
                      fromName: "Helson",
                      subject,
                    },
                  });
                }}
                height="400px"
                defaultLanguage="html"
                language="sql"
                options={{
                  minimap: { enabled: false },
                  selectOnLineNumbers: false,
                  cursorStyle: "line",
                  lineNumbers: "off",
                  wordWrapColumn: 60,
                  wordWrap: "wordWrapColumn",
                }}
              />
            )}
          </div>
          <div className="editor-preview-area">
            <p>Preview your email here:</p>
            <p>
              <span className="bold">To:</span>
              {" Example Contact <example@test.com>"}
            </p>
            <p>
              <span className="bold">Subject: </span>
              {subject}
            </p>
            <EmailRenderer html={html} />
          </div>
        </div>
        <div className="delete-wrapper">
          <p
            className={classNames(styles.go_back, styles.bold_text, "delete")}
            onClick={onDeleteEmail}
          >
            <FontAwesomeIcon icon={faTimes} width={10} />
            <span>Delete</span>
          </p>
        </div>
      </div>
      <style jsx>
        {`
          .wrapper {
            box-shadow: var(--subtle-shadow);
            border: var(--border-grey);
            border-radius: 4px;
            padding: 2em 1.5em;
          }
          .editor {
            display: flex;
          }
          p {
            margin-block-start: 6px;
            margin-block-end: 6px;
          }
          .bold {
            font-weight: 500;
          }
          .control {
            display: flex;
            flex-direction: row;
          }
          .editor_wrapper {
            display: flex;
            flex-direction: row;
          }
          .editor_wrapper > * + * {
            margin-left: 1em;
          }
          .editor-text-area {
            min-width: 500px;
          }
          .editor-preview-area {
            display: flex;
            flex-direction: column;
            border: 1px solid #b6b6b8;
            padding: 1em;
            width: 100%;
            border-radius: 8px;
            background: #f7f9fb;
          }
          .delete-wrapper {
            display: flex;
            align-items: flex-end;
          }
          .delete {
            color: #55585c;
            margin-left: auto;
          }
        `}
      </style>
    </>
  );
};

interface Props {
  email?: EmailType;
  name: string;
  onChangeName: (text: string) => void;
}

const EmailEditor = (props: Props) => {
  const [createEmail, { data, loading, error }] = useMutation(CREATE_EMAIL);

  useEffect(() => {
    if (!props.email) {
      createEmail({
        variables: {},
      });
    }
  }, []);

  if (props.email) {
    return (
      <EmailEditorInner
        name={props.name}
        onChangeName={props.onChangeName}
        email={props.email}
      />
    );
  } else if (loading) {
    return <CircularProgress />;
  } else if (error) {
    return <p>{error.message}</p>;
  } else if (data) {
    return (
      <EmailEditorInner
        name={props.name}
        onChangeName={props.onChangeName}
        email={data.createEmail}
      />
    );
  } else {
    return null;
  }
};
export default EmailEditor;
