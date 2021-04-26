import { useEffect, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import styles from "../../../styles/Home.module.css";
import classnames from "classnames";
import BlueButton from "../../../components/BlueButton";
import Link from "next/link";
import SegmentFirstGIF from "../../../public/segment_first.gif";
import SegmentSecondGIF from "../../../public/segment_second.gif";
import SegmentThirdGIF from "../../../public/segment_third.gif";
import SegmentFourthGIF from "../../../public/segment_fourth.gif";
import CopyDefault from "../../../public/copy_default.svg";
import CopySuccess from "../../../public/copy_success.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useTimeout from "@rooks/use-timeout";
import ReactModalImage from "react-modal-image";
import OnboardingLayout from "../../../layout/OnboardingLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const CREATE_SEGMENT_WEBHOOK = gql`
  mutation createSegmentWebhook {
    createSegmentWebhook {
      id
      token
    }
  }
`;

const SegmentPage = () => {
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const { start: start1 } = useTimeout((): void => {
    setCopied1(false);
  }, 2000);
  const { start: start2 } = useTimeout((): void => {
    setCopied2(false);
  }, 2000);

  const router = useRouter();
  const [
    createSegmentWebhook,
    { data: segmentData, loading: segmentLoading, error: segmentError },
  ] = useMutation(CREATE_SEGMENT_WEBHOOK);

  useEffect(() => {
    createSegmentWebhook();
  }, []);

  return (
    <OnboardingLayout index={1}>
      <div
        className={classnames(
          styles.container_content,
          styles.segment_container_wrapper
        )}
      >
        <Link href="/onboarding/integrations">
          <p className={classnames(styles.go_back, styles.bold_text)}>
            <FontAwesomeIcon icon={faChevronLeft} width={10} />
            <span>Go back</span>
          </p>
        </Link>
        <h1 className={styles.title_with_back}>Connect Segment</h1>

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
          <h3>
            <center>Webhook Settings</center>
          </h3>
          <p className={styles.subtitle}>URL:</p>
          <code className={styles.token_block}>
            <p>https://api.sequence.so/event/segment</p>
            <CopyToClipboard
              text={"https://api.sequence.so/event/segment"}
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

        <BlueButton
          text="Next"
          onClick={(): void => {
            router.push("/onboarding/segment/waiting");
          }}
        />
      </div>
    </OnboardingLayout>
  );
};

export default SegmentPage;
