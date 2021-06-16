import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import DashboardLayout from "layout/DashboardLayout";
import EmailEditor from "components/email/EmailEditor";
import DynamicTitleBar from "components/DynamicTitleBar";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DefaultViewLayout from "layout/DefaultViewLayout";
import { useEffect, useState } from "react";
import { PAGE_DEFAULTS } from "constants/page";
import GQLErrorMessage from "components/GQLErrorMessage";

export const GET_EMAIL_BY_ID = gql`
  query GetEmailsById($id: ID) {
    emails(id: $id) {
      page
      rows
      nodes {
        id
        name
        from
        fromName
        bodyHtml
        subject
        sentCount
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;

export type EmailType = {
  id: string;
  name: string;
  from: string;
  fromName: string | null;
  bodyHtml: string;
  subject: string;
  sentCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type EmailListContentProps = {
  emails: {
    page: number;
    rows: number;
    nodes: EmailType[];
  };
};

const EmailsByIdPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const { data, loading, error } = useQuery<EmailListContentProps>(
    GET_EMAIL_BY_ID,
    {
      variables: {
        id,
      },
      fetchPolicy: "no-cache",
    }
  );
  const [title, setTitle] = useState("");

  const onChangeTitleText = (text: string) => {
    setTitle(text);
  };
  useEffect(() => {
    if (id && data?.emails?.nodes[0].name) {
      setTitle(data?.emails?.nodes[0].name);
    }
  }, [id, data?.emails]);

  let RenderContents: JSX.Element;
  if (id && data) {
    if (!data?.emails?.nodes[0].deletedAt) {
      RenderContents = (
        <EmailEditor
          name={title}
          onChangeName={onChangeTitleText}
          email={data.emails.nodes[0]}
        />
      );
    } else {
      RenderContents = <GQLErrorMessage error="This email has been deleted" />;
    }
  }

  return (
    <DashboardLayout index={1}>
      <>
        <DynamicTitleBar
          title={title}
          onChangeTitleText={onChangeTitleText}
          subtitle={PAGE_DEFAULTS.emails.id.subtitle}
          showAction={false}
          placeholderTitle={PAGE_DEFAULTS.emails.id.placeholder}
          icon={<FontAwesomeIcon icon={faEnvelope} color={"#4a7da7"} />}
        ></DynamicTitleBar>
        <DefaultViewLayout>
          <>
            {loading && <CircularProgress />}
            {error && <GQLErrorMessage error={error.message} />}
            {RenderContents}
          </>
        </DefaultViewLayout>
        <style jsx>{`
          .content {
            border: 1px solid #b6b6b8;
            padding: 21px 17px;
            border-radius: 4px;
            margin-bottom: 4em;
          }
          h3 {
            margin-block-start: 0px;
            margin-block-end: 0px;
            font-weight: 600;
            font-size: 24px;
            line-height: 31px;
            color: #222325;
          }
        `}</style>
      </>
    </DashboardLayout>
  );
};

export default EmailsByIdPage;
