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
import { useState } from "react";

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

const CreateEmailPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [title, setTitle] = useState("");

  const onChangeTitleText = (text: string) => {
    setTitle(text);
  };

  return (
    <DashboardLayout index={1}>
      <>
        <DynamicTitleBar
          title={title}
          onChangeTitleText={onChangeTitleText}
          subtitle="Create an email to send to a list of customers."
          showAction={false}
          placeholderTitle="Untitled Email"
          icon={<FontAwesomeIcon icon={faEnvelope} color={"#4a7da7"} />}
        ></DynamicTitleBar>
        <DefaultViewLayout>
          <EmailEditor name={title} onChangeName={onChangeTitleText} />
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

export default CreateEmailPage;
