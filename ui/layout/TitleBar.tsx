import BlueButton from "../components/BlueButton";
import { defaultProp } from "../services/defaultProp";
import styles from "../styles/Home.module.css";

interface Props {
  title: string;
  subtitle: string;
  renderCreateAlert?: boolean;
}

const TitleBar = (props: Props) => {
  const renderCreateAlert = defaultProp(props.renderCreateAlert, true);
  return (
    <div className={styles.title_bar_container}>
      <div className={styles.title_text}>
        <h1>{props.title}</h1>
        <p>{props.subtitle}</p>
      </div>
      {renderCreateAlert && (
        <BlueButton
          className={styles.title_action_button}
          text="+ Create Alert"
        />
      )}
      <div className={styles.title_bar_line}></div>
    </div>
  );
};

export default TitleBar;
