import { useRouter } from "next/router";
import BlueButton from "../components/BlueButton";
import { defaultProp } from "../services/defaultProp";
import styles from "../styles/Home.module.css";

interface Props {
  title: string;
  subtitle: string;
  showAction?: boolean;
  actionText?: string;
  icon?: string | JSX.Element;
  actionDisabled?: boolean;
  // actionTooltip?: JSX.Element;
  actionUrl?: string;
  hierarchy?: { name: string; route?: string }[];
}

const TitleBar = (props: Props) => {
  const router = useRouter();
  const showAction = defaultProp(props.showAction, true);
  const actionText = defaultProp(props.actionText, "+ Create Alert");
  const actionUrl = defaultProp(props.actionUrl, "/alerts/create");

  return (
    <div className={styles.title_bar_container}>
      <div className={styles.title_text}>
        {/* <p className={styles.title_back}>
          {props.hierarchy.map((e) => e.name)}
          Emails / <span className={styles.title_back_current}>Builder</span>
        </p> */}
        <h1>
          {props.icon ? (
            typeof props.icon === "string" ? (
              <span className={styles.title_icon}>
                <img src={props.icon} />
              </span>
            ) : (
              <span className={styles.title_icon}>{props.icon}</span>
            )
          ) : null}
          {props.title}
        </h1>
        <p>{props.subtitle}</p>
      </div>
      {showAction && (
        <BlueButton
          className={styles.title_action_button}
          text={actionText}
          onClick={(): void => {
            router.push(actionUrl);
          }}
          disabled={props.actionDisabled}
        />
      )}
      <div className={styles.title_bar_line}></div>
    </div>
  );
};

export default TitleBar;
