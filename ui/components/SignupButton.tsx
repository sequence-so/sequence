import React from "react";
import styles from "../styles/Home.module.css";
import GoogleIcon from "../public/google.svg";

interface Props {
  onClick?: () => {};
  href?: string;
}

const SignupButton = React.forwardRef<{}, Props>(({ onClick, href }, ref) => {
  return (
    <a className={styles.button} href={href} onClick={onClick} ref={ref as any}>
      <img src={GoogleIcon} />
      <p>Signup or Login with Google</p>
    </a>
  );
});

export default SignupButton;
