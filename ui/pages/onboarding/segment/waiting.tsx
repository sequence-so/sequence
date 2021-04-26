import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import classnames from "classnames";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/Home.module.css";
import { createGlobalState } from "react-hooks-global-state";
import DownArrow from "../../../public/down_arrow.svg";
import BlueButton from "../../../components/BlueButton";
import OnboardingLayout from "../../../layout/OnboardingLayout";
import classNames from "classnames";

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

const GET_SEGMENT_WEBHOOK = gql`
  {
    getSegmentWebhook {
      id
      token
      receivedDataAt
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

  console.log(dataSegment);

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
    <OnboardingLayout index={1}>
      <div
        className={classnames(
          styles.container_content,
          styles.segment_container_wrapper
        )}
      >
        <Link href="/onboarding/segment">
          <p className={classnames(styles.go_back, styles.bold_text)}>
            <FontAwesomeIcon icon={faChevronLeft} width={10} />
            <span>Go back</span>
          </p>
        </Link>
        <h1>
          {!dataSegment?.getSegmentWebhook?.receivedDataAt
            ? "Waiting for Segment Data..."
            : "Got Segment Data!"}{" "}
        </h1>
        {!dataSegment?.getSegmentWebhook?.receivedDataAt ? (
          <p>
            Waiting for data to flow from Segment...
            <br />
            <br /> Try triggering an event in your app now.
          </p>
        ) : (
          <p>
            Received an event from Segment. Your webhook is configured properly.
          </p>
        )}

        <div
          className={styles.segment_container}
          style={{
            minWidth: 250,
            minHeight: 130,
            display: "flex",
            alignItems: "center",
          }}
        >
          <h3>Webhook Settings</h3>
          <div style={{ display: "flex", alignItems: "center" }}>
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
        </div>

        <BlueButton
          text="Done"
          onClick={(): void => {
            router.push("/onboarding/integrations");
          }}
          disabled={!dataSegment?.getSegmentWebhook?.receivedDataAt}
        />
      </div>
    </OnboardingLayout>
  );
};

export default SegmentWaitingPage;
