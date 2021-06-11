import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import classnames from "classnames";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/Home.module.css";
import { createGlobalState } from "react-hooks-global-state";
import DownArrow from "../../../public/down_arrow.svg";
import BlueButton from "../../../components/BlueButton";
import OnboardingLayout from "../../../layout/OnboardingLayout";
import classNames from "classnames";
import { GET_USER } from "components/ProfileDropdown";

const initialState = { token: "" };
const { useGlobalState } = createGlobalState(initialState);

const GET_SEGMENT_WEBHOOK = gql`
  query GetSegmentWebhook {
    getSegmentWebhook {
      id
      token
      receivedDataAt
    }
  }
`;

const SegmentWaitingPage = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_USER);
  const {
    loading: loadingSegment,
    error: errorSegment,
    data: dataSegment,
  } = useQuery(GET_SEGMENT_WEBHOOK, {
    pollInterval: 1000,
    fetchPolicy: "no-cache",
  });

  return (
    <OnboardingLayout index={1}>
      <>
        <div
          className={classnames(
            styles.container_content,
            styles.segment_container_wrapper
          )}
          style={{ width: "100%" }}
        >
          <Link href="/onboarding/segment">
            <p className={classnames(styles.go_back, styles.bold_text)}>
              <FontAwesomeIcon icon={faChevronLeft} width={10} />
              <span>Back</span>
            </p>
          </Link>
          <h1>
            {!dataSegment?.getSegmentWebhook?.receivedDataAt
              ? "Waiting for Segment Data..."
              : "Got Segment Data!"}{" "}
          </h1>
          {!dataSegment?.getSegmentWebhook?.receivedDataAt ? (
            <>
              {/* <p>Waiting for data to flow from Segment...</p> */}
              <div className="exclaim-well">
                <div className="exclaim-well-left">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    style={{ color: "#D1B72E" }}
                  ></FontAwesomeIcon>
                </div>
                <div className="exclaim-well-text">
                  <p>Try triggering an event in your app now.</p>
                  <p>Make sure the webhook is turned on.</p>
                </div>
              </div>
            </>
          ) : (
            <p>
              Received an event from Segment. Your webhook is configured
              properly.
            </p>
          )}

          <hr />

          <h3>Webhook Status</h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              className={classNames(
                !dataSegment?.getSegmentWebhook?.receivedDataAt
                  ? styles.blinking_circle_anim
                  : styles.blinking_circle_green,
                styles.blinking_circle
              )}
            ></div>
            <span style={{ marginLeft: "8px" }}>
              {dataSegment &&
              dataSegment.getSegmentWebhook &&
              dataSegment.getSegmentWebhook.receivedDataAt
                ? "Received Data!"
                : "Waiting on data..."}
            </span>
          </div>

          <BlueButton
            text="Done"
            onClick={(): void => {
              router.push("/onboarding/integrations");
            }}
            disabled={!dataSegment?.getSegmentWebhook?.receivedDataAt}
          />
        </div>
        <style jsx>{`
          .exclaim-well {
            border: 2px solid #dfcc6b;
            background: #f5edc3;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-radius: 8px;
          }

          .exclaim-well-left {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 16px;
          }

          .exclaim-well > .exclaim-well-text {
            display: flex;
            flex-direction: column;
            padding: 8px 16px;
            padding-left: 4px;
          }

          .exclaim-well > .exclaim-well-text > p {
            margin-block-start: 4px;
            margin-block-end: 4px;
          }
        `}</style>
      </>
    </OnboardingLayout>
  );
};

export default SegmentWaitingPage;
