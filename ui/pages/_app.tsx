import "../styles/globals.css";
import ApolloClient from "../services/apollo";
import { ApolloProvider } from "@apollo/client";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={ApolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
