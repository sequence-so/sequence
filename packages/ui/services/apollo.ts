import {
  ApolloClient,
  ApolloLink,
  from,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

type ServerParseError = Error & {
  response: Response;
  statusCode: number;
  bodyText: string;
};

const httpLink = createHttpLink({
  fetch: (_, options) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/graphql`;
    return fetch(url, options);
  },
});

const logout = () => {
  localStorage.clear();
  window.location.pathname = "/";
};

const errorLink = onError(({ networkError }) => {
  if (networkError && (networkError as ServerParseError).statusCode) {
    const error = networkError as ServerParseError;
    if ((networkError as any).result?.errors) {
      let error = (networkError as any).result?.errors[0];
      if (
        error?.message === "You are not authorized to perform this request."
      ) {
        logout();
      }
    }
    if (error.statusCode === 401) {
      logout();
    }
    if (
      error.message.indexOf("You are not authorized to perform this request.") >
      -1
    ) {
      logout();
    }
  }
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    let token = "";
    try {
      if (!window || !window.localStorage) {
        return;
      }
      token = localStorage.token;
    } catch (error) {}

    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ?? token,
      },
    };
  });
  return forward(operation);
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache,
});

export default client;
