import { useQuery, gql } from "@apollo/client";

const GET_INTEGRATIONS = gql`
  {
    integrations {
      segment
      node
    }
  }
`;

interface IntegrationType {
  integrations: {
    segment: boolean;
    node: boolean;
  };
}

interface Options {
  pollingInterval?: number;
}

export const useDidIntegrate = (options?: Options) => {
  const {
    loading,
    error,
    data: integrations,
  } = useQuery<IntegrationType>(GET_INTEGRATIONS, {
    fetchPolicy: "no-cache",
    pollInterval: options?.pollingInterval,
  });

  const returnIntegrations = !loading && !error && integrations.integrations;

  return { loading, error, integrations: returnIntegrations };
};
