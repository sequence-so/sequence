import React, { useCallback, useContext, useEffect, useState } from "react";
import InspectorSidebarBase from "../InspectorSidebarBase";
import styles from "../sidebar.module.css";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GetEmails, GetEmails_emails_nodes } from "__generated__/GetEmails";
import {
  CREATE_EMAIL,
  GET_EMAILS,
  GET_EMAIL_BY_ID,
} from "components/email/EmailQueries";
import Select from "components/common/Select";
import EmailCampaignNode from "common/campaign/nodes/emailCampaignNode";
import EmailIcon from "public/email_icon.svg";
import { EmailEditorInner } from "components/email/EmailEditor";
import {
  GetEmailsById,
  GetEmailsByIdVariables,
} from "__generated__/GetEmailsById";
import { CircularProgress } from "@material-ui/core";
import GQLErrorMessage from "components/GQLErrorMessage";
import RenderCampaignEmailScheduling from "components/campaign/RenderCampaignEmailScheduling";
import {
  CampaignEmailScheduling,
  EmailCampaignNodeJson,
} from "common/campaign";
import { useDebouncedCampaignNodeUpdate } from "hooks/useDebouncedCampaignNodeUpdate";
import {
  CreateEmail,
  CreateEmailVariables,
  CreateEmail_createEmail,
} from "__generated__/CreateEmail";
import { EditorContext } from "components/campaign/CampaignEditorGrid";

interface Props {
  node: EmailCampaignNode;
}

const generateEmailList = (emails: GetEmails_emails_nodes[]) => {
  return emails.map((email) => {
    return {
      value: email.id,
      label: email.name ?? "(Untitled)",
    };
  });
};

type Option = { label: string; value: string };

const EmailInspector = (props: Props) => {
  const context = useContext(EditorContext);
  const emailCampaignNode = props.node;
  const { update: updateMutation } = useDebouncedCampaignNodeUpdate({
    campaignNode: props.node,
  });
  const [email, setEmail] = useState<CreateEmail_createEmail>();
  const [createEmail] = useMutation<CreateEmail, CreateEmailVariables>(
    CREATE_EMAIL,
    {
      onCompleted(data) {
        // immediately create a draft email
        setEmail(data.createEmail);
        // update our node with the ID
        emailCampaignNode.setEmailId(data.createEmail.id);
        // update API
        updateMutation.current({
          json: {
            emailId: data.createEmail.id,
            originalTemplateId: null,
            scheduling: null,
          } as EmailCampaignNodeJson,
        });
      },
    }
  );
  const [emailTemplateOptions, setEmailTemplateOptions] = useState<Option[]>();
  const [selectedEmailTemplateOption, setSelectedEmailTemplateOption] =
    useState<Option>();
  const [emailScheduling, setEmailScheduling] =
    useState<CampaignEmailScheduling>(props.node.getScheduling());
  const [emailName, setEmailName] = useState<string>();
  const {
    data: emailsData,
    loading: emailsLoading,
    error: emailsError,
  } = useQuery<GetEmails>(GET_EMAILS, {
    fetchPolicy: "no-cache",
    onCompleted(data) {
      const list = generateEmailList(data.emails.nodes);
      setEmailTemplateOptions(list);
      const selectedEmailId = emailCampaignNode.getOriginalTemplateId();
      if (!selectedEmailId) {
        return;
      }
      const selectedOption = list.find((o) => o.value === selectedEmailId);
      setSelectedEmailTemplateOption(selectedOption);
    },
  });

  const [getCampaignNodeEmail] = useLazyQuery<
    GetEmailsById,
    GetEmailsByIdVariables
  >(GET_EMAIL_BY_ID, {
    fetchPolicy: "no-cache",
    variables: {
      id: emailCampaignNode.getEmailId(),
      localTo: "campaigns",
    },
    onCompleted(data) {
      const currEmail = data.emails.nodes[0];
      if (!currEmail) {
        return;
      }
      setEmail(currEmail);
      setEmailName(emailCampaignNode.name);
    },
  });

  // On load: if we have an emailId associated, load it up. Otherwise create an empty email
  useEffect(() => {
    if (emailCampaignNode.getEmailId()) {
      getCampaignNodeEmail();
    } else {
      createEmail({
        variables: {
          localTo: "campaigns",
        },
      });
    }
  }, [emailCampaignNode.getEmailId()]);

  // On selecting a template in the dropdown
  const onSelectEmailOption = useCallback(
    (value: Option) => {
      // update template option
      setSelectedEmailTemplateOption(value);

      // update current email (but keeping our id for our draft email)
      const template = emailsData.emails.nodes.find(
        (e) => e.id === value.value
      );
      setEmail({ ...template, id: email.id, localTo: "campaigns" });
      emailCampaignNode.setOriginalTemplateId(template.id);
      onChangeEmailName(template.name);
      // perform the update
      updateMutation.current({
        name: emailName,
        json: {
          emailId: email.id,
          originalTemplateId: template.id,
          scheduling: emailScheduling,
        } as EmailCampaignNodeJson,
      });
    },
    [email, emailsData, emailScheduling]
  );

  const onChangeEmailName = useCallback((text: string) => {
    setEmailName(text);
    props.node.setName(text);
    context.onChangeNodeName(props.node);
    // perform the update
    updateMutation.current({
      name: text,
    });
  }, []);

  const onChangeScheduling = useCallback(
    (value: CampaignEmailScheduling) => {
      setEmailScheduling(value);
      emailCampaignNode.setScheduling(value);
      updateMutation.current({
        json: {
          emailId: email.id,
          originalTemplateId: selectedEmailTemplateOption?.value,
          scheduling: value,
        } as EmailCampaignNodeJson,
      });
    },
    [selectedEmailTemplateOption, email]
  );

  return (
    <InspectorSidebarBase
      icon={EmailIcon}
      fillColor="#F24A4A"
      title={emailName}
      onChangeTitleText={onChangeEmailName}
      placeholderTitle="Untitled Email"
      subtitle="Send an email to your users."
    >
      {emailsLoading && <CircularProgress />}
      {emailsError && <GQLErrorMessage error={emailsError.message} />}
      {emailsData && (
        <>
          <div
            className={styles.option_title}
            style={{ marginBlockStart: "1em" }}
          >
            CHOOSE TEMPLATE
          </div>
          <Select
            value={selectedEmailTemplateOption}
            options={emailTemplateOptions}
            containerWidth={300}
            onChange={onSelectEmailOption}
          />
        </>
      )}

      {email && (
        <EmailEditorInner
          name={emailCampaignNode.name}
          onChangeName={onChangeEmailName}
          email={email}
          renderWrapper={false}
          renderDeleteEmail={false}
        />
      )}
      <div className={styles.option_title} style={{ marginBlockStart: "1em" }}>
        EMAIL SCHEDULING
      </div>
      <p style={{ marginBlockStart: "0.2em" }}>
        Choose when this email can be sent:
      </p>
      <RenderCampaignEmailScheduling
        selected={emailScheduling}
        onClick={onChangeScheduling}
      />
    </InspectorSidebarBase>
  );
};

export default EmailInspector;
