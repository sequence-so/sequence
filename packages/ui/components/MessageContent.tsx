import { useRouter } from "next/router";
import onboardingStyles from "../pages/onboarding/onboarding.module.css";
import BlueButton from "./BlueButton";
import LogoSquare from "../public/logo_square.svg";

interface Props {
  nextRoute: string;
}

const MessageContent = (props: Props) => {
  const router = useRouter();

  return (
    <>
      <h1>Configure the Message</h1>
      <p>Customize your message by editing the text below.</p>

      <div className={onboardingStyles.message_well}>
        <div className={onboardingStyles.message_well_inner}>
          <img src={LogoSquare} />
          <div className={onboardingStyles.message_well_right}>
            <div className={onboardingStyles.message_title}>
              <p
                style={{
                  color: "#1D1C1D",
                  fontWeight: "bold",
                }}
              >
                Sequence
              </p>
              <p className={onboardingStyles.message_app_bubble}>APP</p>
              <p className={onboardingStyles.message_title}>6:48 PM</p>
            </div>
            <div
              className={onboardingStyles.message_text_area}
              contentEditable={true}
            >
              We’ve detected a change in one of your metrics for user_id 13349
              from <b>{"{{ old_value }}"}</b> to <b>{"{{ new_value }}"}</b>.
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <BlueButton
            text="Next"
            onClick={(): void => {
              router.push(props.nextRoute);
            }}
            style={{ marginRight: 0, marginTop: 10, marginBottom: 10 }}
          />
        </div>
      </div>
    </>
  );
};

export default MessageContent;
