import Link from "next/link";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Home.module.css";
import OnboardingLayout from "./OnboardingLayout";
import { useDidIntegrate } from "../hooks/useDidIntegrate";
import BlueCheckmark from "../public/blue_checkmark.svg";

interface Props {
  name: string;
  title: string;
  thumbnail: string;
  content: string | JSX.Element;
  authorization: JSX.Element;
  instructions?: JSX.Element;
}

const IntegrationLayout = (props: Props) => {
  const { loading, error, integrations } = useDidIntegrate();

  return (
    <>
      <OnboardingLayout index={1}>
        <>
          <div className={classNames(styles.container_content, "content")}>
            <Link href="/onboarding/integrations">
              <p className={classNames(styles.go_back, styles.bold_text)}>
                <FontAwesomeIcon icon={faChevronLeft} width={10} />
                <span>Back</span>
              </p>
            </Link>
            <h1>{props.title}</h1>
            <div className="row">
              <div className="left">
                <img className="thumbnail" src={props.thumbnail}></img>
              </div>
              <div className="right">
                {props.content}
                {!loading && !error && !integrations[props.name] && (
                  <div className="auth_button">{props.authorization}</div>
                )}
              </div>
            </div>
            <div className="row" style={{ paddingTop: "1rem" }}>
              {!loading && !error && integrations[props.name] && (
                <>
                  <p className="cta">
                    <img src={BlueCheckmark} width={28} />
                    You're already integrated with {props.title}.
                  </p>
                </>
              )}
            </div>
            {/* <hr /> */}
            {/* <div className="row">
              <div className="col bottom">
                <h4>PERMISSIONS REQUIRED</h4>
                <p>
                  <img src="/right_arrow.svg" width={12} />
                  View your user profile information.
                </p>
                <p>
                  <img src="/right_arrow.svg" width={12} />
                  Send messages to a specific Discord channel.
                </p>
              </div>
              <div className="col bottom">
                <h4>APP SECURITY</h4>
                <p>
                  <img src="/lock.svg" width={12} />
                  Your data is secured with a 256 bit SSL connection.
                </p>
                <p>
                  <img src="/lock.svg" width={12} />
                  We send messages only to the channel you configure.
                </p>
              </div>
            </div> */}
            {props.instructions && (
              <>
                <hr />
                {props.instructions}
              </>
            )}
          </div>
        </>
      </OnboardingLayout>
      <style jsx>{`
        h1 {
          margin-block-start: 0px;
          margin-block-end: 2rem;
        }
        h4 {
          font-family: "IBM Plex Sans Condensed";
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 18px;
          letter-spacing: 0.04em;
          color: #888888;
          margin-block-start: 12px;
          margin-block-end: 12px;
        }
        hr {
          margin-block-start: 2rem;
          margin-block-end: 1rem;
        }
        .content {
          width: 100%;
          height: 100%;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }
        .row {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          width: 100%;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        p {
          font-size: 1rem;
          line-height: 1rem;
          text-align: center;
          color: #4e4f55;
          margin-block-start: 0px;
          margin-block-end: 0px;
          text-align: left;
        }
        p > img {
          margin-right: 8px;
        }
        .auth_button {
          margin-top: 1rem;
        }
        .left {
          display: flex;
          flex-direction: column;
        }
        .right {
          display: flex;
          flex-direction: column;
          max-width: 451px;
          padding-left: 3.5rem;
        }
        .col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .col > * + * {
          margin-right: 2rem;
        }
        .right > p {
          font-size: 16px;
          line-height: 145%;
          color: #4e4f55;
          text-align: left;
          margin-block-end: 1rem;
        }
        .col.bottom > p {
          font-size: 14px;
          margin-bottom: 6px;
        }
        .thumbnail {
          background: linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.54) 5.56%,
              rgba(232, 232, 232, 0.1) 100%
            ),
            #f9f9fa;
          box-shadow: -20px -20px 40px 6px #ffffff,
            15px 15px 40px rgba(58, 56, 146, 0.15);

          border-radius: 25px;
          width: 10rem;
          height: 10rem;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cta {
          font-family: "IBM Plex Sans";
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 23px;
          text-align: center;
          margin-top: 1rem;
          color: #222325;
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 12px;
          padding: 1rem;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default IntegrationLayout;
