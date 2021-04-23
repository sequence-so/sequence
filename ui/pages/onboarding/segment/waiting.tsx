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
          <div
            className={classnames(
              styles.container_content,
              styles.segment_container_wrapper
            )}
          >
            <h1>Waiting for Segment Data...</h1>
            <p className={styles.not_ready_text}>
              <Link href="/onboarding/datasources">
                <span className={styles.bold_text}>Go back</span>
              </Link>
            </p>
            <p>
              Waiting for data to flow from Segment...
              <br />
              <br /> Try triggering an event in your app now.
            </p>

            <div className={styles.segment_container}>
              <h3>Webhook Settings</h3>
              {dataSegment &&
              dataSegment.getSegmentWebhook &&
              dataSegment.getSegmentWebhook.receivedDataAt
                ? "Received Data!"
                : "Waiting on data..."}
            </div>

            <BlueButton
              text="Done"
              onClick={(): void => {
                router.push("/onboarding/datasources");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentWaitingPage;
