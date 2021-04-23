import { useEffect, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import styles from "../../../styles/Home.module.css";
import { createGlobalState } from "react-hooks-global-state";
import DownArrow from "../../../public/down_arrow.svg";
import Logo from "../../../public/main_logo.svg";
import classnames from "classnames";
import BlueButton from "../../../components/BlueButton";
import Link from "next/link";
import AuthIntercom from "../../../components/AuthIntercom";
import SegmentFirstGIF from "../../../public/segment_first.gif";
import SegmentSecondGIF from "../../../public/segment_second.gif";
import SegmentThirdGIF from "../../../public/segment_third.gif";
import SegmentFourthGIF from "../../../public/segment_fourth.gif";
import CopyDefault from "../../../public/copy_default.svg";
import CopySuccess from "../../../public/copy_success.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useTimeout from "@rooks/use-timeout";
import ReactModalImage from "react-modal-image";

const initialState = { token: "" };
const { useGlobalState } = createGlobalState(initialState);

const GET_USER = gql`
  {
    getUser {
      id
      firstName
      lastName
      email
      photo
    }
  }
`;

const CREATE_SEGMENT_WEBHOOK = gql`
  mutation createSegmentWebhook {
    createSegmentWebhook {
      id
      token
    }
  }
`;

const IntercomPage = () => {
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const { start: start1 } = useTimeout((): void => {
    setCopied1(false);
  }, 2000);
  const { start: start2 } = useTimeout((): void => {
    setCopied2(false);
  }, 2000);

  const router = useRouter();
  const { loading, error, data } = useQuery(GET_USER);
  const [
    createSegmentWebhook,
    { data: segmentData, loading: segmentLoading, error: segmentError },
  ] = useMutation(CREATE_SEGMENT_WEBHOOK);

  useEffect(() => {
    createSegmentWebhook();
  }, []);

  const RenderUser = data && (
    <div className={styles.profile}>
      <img
        className={styles.profile_image}
        width={30}
        height={30}
        src={data.getUser.photo}
      />
      <p>Hi, {data.getUser.firstName}</p>
      <img className={styles.profile_arrow} src={DownArrow} />
    </div>
  );
  return (
    <div className={styles.with_sidebar}>
      <div>
        <div className={styles.sidebar}>
          <img className={styles.sidebar_logo} src={Logo} />
          <div className={styles.sidebar_link}>Welcome</div>
          <div className={styles.sidebar_link_active}>Data Sources</div>
          <div className={styles.sidebar_link}>Create an Alert</div>
          <div className={styles.sidebar_link}>Done</div>
        </div>
        <div className={styles.container}>
          {RenderUser}
          <div className={styles.container_content}>
            <h1>Connect Segment</h1>
            <p className={styles.not_ready_text}>
              <Link href="/onboarding/datasources">
                <span className={styles.bold_text}>Go back</span>
              </Link>
            </p>
            <h2>1. Select Your Source</h2>
            <p>
              In the Segment dashboard, select your Javascript or backend API
              source.
            </p>
            <ReactModalImage
              className={styles.segment_tutorial_image}
              small={SegmentFirstGIF}
              large={SegmentFirstGIF}
              hideDownload={true}
              hideZoom={true}
            />

            <h2>2. Add "Webhook" As a Destination</h2>
            <p>
              In the Segment dashboard, select your Javascript or backend API
              source.
            </p>
            <ReactModalImage
              className={styles.segment_tutorial_image}
              small={SegmentSecondGIF}
              large={SegmentSecondGIF}
              hideDownload={true}
              hideZoom={true}
            />

            <h2>3. Configure the webhook</h2>
            <p>
              In the Destination Settings, add the Sequence API URL and
              Authorization token.
            </p>
            <ReactModalImage
              className={styles.segment_tutorial_image}
              small={SegmentThirdGIF}
              large={SegmentThirdGIF}
              hideDownload={true}
              hideZoom={true}
            />

            <div className={styles.segment_container}>
              <p className={styles.subtitle}>URL:</p>
              <code className={styles.token_block}>
                <p>https://api.sequence.so/api/segment</p>
                <CopyToClipboard
                  text={"https://api.sequence.so/api/segment"}
                  onCopy={(): void => {
                    setCopied1(true);
                    start1();
                  }}
                >
                  {copied1 ? (
                    <img src={CopySuccess} width={24}></img>
                  ) : (
                    <img src={CopyDefault} width={24}></img>
                  )}
                </CopyToClipboard>
              </code>
              <p className={styles.subtitle}>Authorization token:</p>
              <code className={styles.token_block}>
                <p>{segmentData && segmentData.createSegmentWebhook.token}</p>
                <CopyToClipboard
                  text={segmentData && segmentData.createSegmentWebhook.token}
                  onCopy={(): void => {
                    setCopied2(true);
                    start2();
                  }}
                >
                  {copied2 ? (
                    <img src={CopySuccess} width={24}></img>
                  ) : (
                    <img src={CopyDefault} width={24}></img>
                  )}
                </CopyToClipboard>
              </code>
            </div>
            <h2>4. Turn the Webhook On</h2>
            <p>Turn the webhook toggle on.</p>
            <ReactModalImage
              className={styles.segment_tutorial_image}
              small={SegmentFourthGIF}
              large={SegmentFourthGIF}
              hideDownload={true}
              hideZoom={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntercomPage;
