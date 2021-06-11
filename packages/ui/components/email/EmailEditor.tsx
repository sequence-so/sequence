import { useCallback, useEffect, useRef, useState } from "react";
import EmailRenderer from "./EmailRenderer";
import RichEmailEditor from "./RichEmailEditor";
import CreateInput from "components/common/CreateInput";
import { useMutation } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import styles from "styles/Home.module.css";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { defaultProp } from "services/defaultProp";
import { CREATE_EMAIL, DELETE_EMAIL, UPDATE_EMAIL } from "./EmailQueries";
import { UpdateEmail, UpdateEmailVariables } from "__generated__/UpdateEmail";
import { DeleteEmail, DeleteEmailVariables } from "__generated__/DeleteEmail";
import {
  CreateEmail,
  CreateEmailVariables,
  CreateEmail_createEmail,
} from "__generated__/CreateEmail";
import TestEmailButton from "./TestEmailButton";
import SavingIndicator from "components/SavingIndicator";
import CodeEmailEditor from "./CodeEmailEditor";
import PreviewCodeEmailButton from "./PreviewCodeEmailButton";

type Email = CreateEmail_createEmail;

interface EmailEditorInnerProps {
  email: Email;
  name: string;
  onChangeName: (text: string) => void;
  renderWrapper?: boolean;
  renderDeleteEmail?: boolean;
}

type EmailKind = "code" | "rich";

export const EmailEditorInner = (props: EmailEditorInnerProps) => {
  const renderWrapper = defaultProp(props.renderWrapper, true);
  const renderDeleteEmail = defaultProp(props.renderDeleteEmail, true);
  const router = useRouter();
  const [updateEmail, { loading: updateEmailLoading }] = useMutation<
    UpdateEmail,
    UpdateEmailVariables
  >(UPDATE_EMAIL);
  const [deleteEmail] = useMutation<DeleteEmail, DeleteEmailVariables>(
    DELETE_EMAIL,
    {
      onCompleted() {
        router.push("/emails");
      },
    }
  );
  const [emailKind, setEmailKind] = useState<EmailKind>(
    props.email.kind as EmailKind
  );
  const [html, setHtml] = useState<string>(props.email?.bodyHtml || "");
  const [subject, setSubject] = useState(props.email?.subject || "");
  const [emailName, setEmailName] = useState(props.name || "");
  const updateFunc = (values: { variables: UpdateEmailVariables }) =>
    updateEmail(values);
  const debouncedUpdate = useRef<any>(
    debounce((values) => {
      updateFunc(values);
    }, 1000)
  );

  // On name update from props
  useEffect(() => {
    if (props.name !== emailName) {
      setEmailName(props.name);
      debouncedUpdate.current({
        variables: {
          id: props.email.id,
          name: props.name,
          bodyHtml: html,
          bodyText: "",
          subject,
          kind: emailKind,
        },
      });
    }
  }, [props.name]);

  // If the whole email changes, e.g. template is updated
  useEffect(() => {
    setHtml(props.email.bodyHtml);
    setSubject(props.email.subject);
    setEmailName(props.email.name);
    debouncedUpdate.current({
      variables: {
        id: props.email.id,
        name: props.email.name,
        bodyHtml: props.email.bodyHtml,
        subject: props.email.subject,
        bodyText: "",
        kind: props.email.kind,
      },
    });
  }, [props.email]);

  const onDeleteEmail = () => {
    deleteEmail({
      variables: {
        id: props.email.id,
      },
    });
  };

  const toggleEmailKind = useCallback(() => {
    let nextEmailKind: EmailKind;
    if (emailKind === "rich") {
      nextEmailKind = "code";
    } else {
      nextEmailKind = "rich";
    }
    setEmailKind(nextEmailKind);
    debouncedUpdate.current({
      variables: {
        id: props.email.id,
        name: emailName,
        bodyHtml: html,
        bodyText: "",
        subject: subject,
        kind: nextEmailKind,
      },
    });
  }, [emailKind, emailName, html, subject]);

  useEffect(() => {
    return () => {
      debouncedUpdate.current.cancel();
    };
  }, []);

  return (
    <>
      <div className={renderWrapper ? "wrapper" : ""}>
        <div className={"editor_wrapper"}>
          <div className="editor-text-area">
            <p style={{ fontWeight: 500, marginBlockEnd: 14 }}>Subject:</p>
            <CreateInput
              value={subject}
              placeholder="Subject"
              onChangeText={(value) => {
                setSubject(value);
                debouncedUpdate.current({
                  variables: {
                    id: props.email.id,
                    name: emailName,
                    bodyHtml: html,
                    bodyText: "",
                    subject: value,
                    kind: emailKind,
                  },
                });
              }}
              style={{ marginBottom: 14, width: "100%" }}
            ></CreateInput>
            {emailKind === "rich" && (
              <RichEmailEditor
                value={html}
                onChangeModes={toggleEmailKind}
                onChange={(text) => {
                  console.log("setHtml:" + text);
                  setHtml(text);
                  debouncedUpdate.current({
                    variables: {
                      id: props.email.id,
                      name: emailName,
                      bodyHtml: text,
                      bodyText: "",
                      subject,
                      kind: emailKind,
                    },
                  });
                }}
              />
            )}
            {emailKind === "code" && (
              <CodeEmailEditor
                html={html}
                onChangeModes={toggleEmailKind}
                onChange={(newValue) => {
                  setHtml(newValue);
                  debouncedUpdate.current({
                    variables: {
                      id: props.email.id,
                      name: emailName,
                      bodyHtml: newValue,
                      bodyText: "",
                      subject,
                      kind: emailKind,
                    },
                  });
                }}
              />
            )}
          </div>
          {emailKind === "rich" && (
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
          )}
        </div>
        <div className="bottom-row">
          <SavingIndicator
            saveText="Email saved."
            isSaving={updateEmailLoading}
          />
          <div className="align-right">
            <TestEmailButton emailId={props.email.id} />
            {emailKind === "code" && <PreviewCodeEmailButton html={html} />}

            {renderDeleteEmail && (
              <div className="delete-wrapper">
                <p
                  className={classNames(
                    styles.go_back,
                    styles.bold_text,
                    "delete"
                  )}
                  onClick={onDeleteEmail}
                >
                  <FontAwesomeIcon icon={faTimes} width={10} />
                  <span>Delete</span>
                </p>
              </div>
            )}
          </div>
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
            ${emailKind === "code" ? "width: 100%" : ""}
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
          .editor-preview-area-code {
            display: flex;
            flex-direction: column;
            border: 1px solid #b6b6b8;
            padding: 1em;
            width: 100%;
          }
          .delete-wrapper {
            display: flex;
            align-items: flex-end;
          }
          .delete {
            color: #55585c;
            margin-left: auto;
          }
          .bottom-row {
            margin-top: 8px;
            display: flex;
            flex-direction: row;
          }
          .align-right {
            margin-left: auto;
            display: flex;
            flex-direction: row;
          }
        `}
      </style>
    </>
  );
};

interface Props {
  email?: Email;
  name: string;
  onChangeName: (text: string) => void;
}

const EmailEditor = (props: Props) => {
  const [createEmail, { data, loading, error }] = useMutation<
    CreateEmail,
    CreateEmailVariables
  >(CREATE_EMAIL);

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
