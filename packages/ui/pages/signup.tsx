import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import LogoColor from "../public/logo_color.svg";
import LoginForm from "components/login/LoginForm";
import Link from "next/link";
import Wordmark from "components/Wordmark";

export default function Signup() {
  const [domain, setDomain] = useState("");
  const router = useRouter();

  useEffect(() => {
    setDomain(process.env.NEXT_PUBLIC_API_URL);
  }, []);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (localStorage.token) {
      router.push("/campaigns");
    }
  }, [router.isReady]);

  const onSubmitSignup = (email: string, password: string) => {
    let headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        const result = await res.json();
        throw result;
      })
      .then((data) => {
        localStorage.token = data.token;
        setTimeout(() => {
          window.location = data.url;
        });
      });
  };
  return (
    <div className={styles.login_container}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />

        <meta
          name="description"
          content="Sequence lets you monitor your user's behavior and create alerts based off of events that you specify as important. "
        />
        <meta property="og:title" content="Sequence" />
        <meta
          property="og:description"
          content="Sequence lets you monitor your user's behavior and create alerts based off of events that you specify as important. "
        />
        <meta
          property="og:image"
          content="https://my.sequence.so/big_logo_color.png"
        />
        <meta
          property="og:image:alt"
          content="Alerts for product led growth companies"
        />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:url" content="https://www.mywebsite.com/page" />
        <link rel="canonical" href="https://www.mywebsite.com/page" />

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
          width={80}
          height={80}
        />
        <h2 className={styles.signup_title}>Signup</h2>
        <LoginForm type="signup" perform={onSubmitSignup} />
        <Link href="/">
          <a style={{ marginTop: "1em", color: "#4191E4" }}>
            <p>Have an account? Login here.</p>
          </a>
        </Link>
        <Wordmark />
      </div>
      <div className={styles.signup_right}></div>
    </div>
  );
}
