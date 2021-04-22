import {
  ApolloClient,
  ApolloLink,
  from,
  createHttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

type ServerParseError = Error & {
  response: Response;
  statusCode: number;
  bodyText: string;
};

const httpLink = createHttpLink({
  fetch: (_, options) => {
    if ((options?.headers as any).authorization) {
      // return fetch(`${publicRuntimeConfig.apiEndpoint}/graphql`, options);
      return fetch(`http://localhost:3000/graphql`, options);
    }
    return fetch(`http://localhost:3000/graphql`, options);
  },
});

const logout = () => console.log("do logout here");

const errorLink = onError(({ networkError }) => {
  if (networkError && (networkError as ServerParseError).statusCode) {
    const error = networkError as ServerParseError;
    if (error.statusCode === 401) {
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

// client.writeQuery({
//   query: gql`
//     query WriteLocalState {
//       state {
//         isLoggedIn
//       }
//     }
//   `,
//   data: {
//     state: {
//       __typename: "State",
//       isLoggedIn: !!localStorage.token,
//     },
//   },
// });

export default client;
