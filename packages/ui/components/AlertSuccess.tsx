import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import BlueButton from "./BlueButton";
import GreenCheckmark from "../public/green_check.svg";
import { defaultProp } from "../services/defaultProp";
import { gql, useMutation } from "@apollo/client";

interface Props {
  nextRoute: string;
  text1?: string;
  text2?: string;
}

const UPDATE_USER_ONBOARDED = gql`
  mutation UpdateUser($onboardedAt: Date) {
    updateUser(onboardedAt: $onboardedAt) {
      id
      onboardedAt
    }
  }
`;
const AlertSuccess = (props: Props) => {
  const [updateUser] = useMutation(UPDATE_USER_ONBOARDED);
  const router = useRouter();
  const text1 = defaultProp(
    props.text1,
    "Now that your data is imported, create an Audience or an Email in the dashboard."
  );
  const text2 = defaultProp(
    props.text2,
    "Click below to explore your dashboard and begin sending Email blasts."
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
          updateUser({
            variables: {
              onboardedAt: new Date(),
            },
          }).then((res) => {
            router.push(props.nextRoute);
          });
        }}
      />
    </div>
  );
};

export default AlertSuccess;
