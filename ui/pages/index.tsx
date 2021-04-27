import Head from "next/head";
import SignupButton from "../components/SignupButton";
import styles from "../styles/Home.module.css";
import LogoColor from "../public/logo_color.svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [domain, setDomain] = useState("");
  const router = useRouter();

  useEffect(() => {
    const href = window.location.href;
    if (href.includes("localhost")) {
      setDomain("http://localhost:3000");
    } else {
      setDomain("https://api-dev.sequence.so");
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (localStorage.token) {
      router.push("/dashboard");
    }
  }, [router.isReady]);

  return (
    <div className={styles.login_container}>
      <Head>
        <title>Sequence</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.signup_left}>
        <img
          className={styles.signup_logo}
          src={LogoColor}
          width={120}
          height={120}
        />
        <h2 className={styles.signup_title}>Signup</h2>
        <Link href={domain + "/auth/google"} passHref>
          <SignupButton />
        </Link>
        <p className={styles.login_footer}>
          Copyright © 2021 Sequence Technologies
        </p>
      </div>
      <div className={styles.signup_right}></div>
    </div>
  );
}
