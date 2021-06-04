import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import BlueButton from "./BlueButton";
import GreenCheckmark from "../public/green_check.svg";
import { defaultProp } from "../services/defaultProp";

interface Props {
  nextRoute: string;
  text1?: string;
  text2?: string;
}

const AlertSuccess = (props: Props) => {
  const router = useRouter();
  const text1 = defaultProp(
    props.text1,
    "You’ve configured your alert successfully."
  );
  const text2 = defaultProp(
    props.text2,
    "Click below to explore your dashboard and see how else Hoco can help you improve."
  );
  return (
    <div
      className={styles.container_content}
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100% - 100px)",
        marginTop: 60,
      }}
    >
      <img src={GreenCheckmark} style={{ width: 60 }} />
      <h1>You’re All Set!</h1>
      <p>{text1}</p>
      <p>{text2}</p>

      <BlueButton
        text="View Dashboard"
        onClick={(): void => {
          router.push(props.nextRoute);
        }}
      />
    </div>
  );
};

export default AlertSuccess;
