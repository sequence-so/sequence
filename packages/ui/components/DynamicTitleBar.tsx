import { useRouter } from "next/router";
import BlueButton from "../components/BlueButton";
import { defaultProp } from "../services/defaultProp";
import styles from "../styles/Home.module.css";
import TitleInput from "./input/TitleInput";

interface Props {
  title: string;
  subtitle: string;
  showAction?: boolean;
  actionText?: string;
  actionDisabled?: boolean;
  actionUrl?: string;
  hierarchy?: { name: string; route?: string }[];
  onChangeTitleText: (text: string) => void;
  placeholderTitle?: string;
  icon?: string | JSX.Element;
}

const DynamicTitleBar = (props: Props) => {
  const router = useRouter();
  const showAction = defaultProp(props.showAction, true);
  const actionText = defaultProp(props.actionText, "+ Create Alert");
  const actionUrl = defaultProp(props.actionUrl, "/alerts/create");
  const onChangeTitleText = (text: string) => {
    props.onChangeTitleText(text);
  };

  return (
    <div className={styles.title_bar_container}>
      <div className={styles.title_text}>
        <div className={styles.title_text_wrapper}>
          {props.icon && (
            <span className={styles.title_icon}>
              {typeof props.icon === "string" ? (
                <img src={props.icon} />
              ) : (
                props.icon
              )}
            </span>
          )}
          <TitleInput
            value={props.title}
            onChangeText={onChangeTitleText}
            placeholder={props.placeholderTitle}
          />
        </div>
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

export default DynamicTitleBar;
