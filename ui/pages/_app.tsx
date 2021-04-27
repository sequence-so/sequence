import "../styles/globals.css";
import ApolloClient from "../services/apollo";
import { ApolloProvider } from "@apollo/client";
import { useEffect } from "react";
import Head from "next/head";
import { install } from "../services/analytics";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../layout/theme";
import { IntercomProvider, useIntercom } from "react-use-intercom";

const INTERCOM_APP_ID = "idhc7omi";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    install();
  }, []);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_SSL) {
      var httpTokens = /^http:\/\/(.*)$/.exec(window.location.href);
      if (httpTokens) {
        window.location.replace("https://" + httpTokens[1]);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Sequence</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <ApolloProvider client={ApolloClient}>
        <ThemeProvider theme={theme}>
          <IntercomProvider appId={INTERCOM_APP_ID}>
            <Component {...pageProps} />
          </IntercomProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
