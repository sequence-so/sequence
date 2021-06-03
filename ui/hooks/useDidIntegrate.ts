import { useQuery, gql } from "@apollo/client";

const GET_INTEGRATIONS = gql`
  {
    getIntegrations {
      intercom
      segment
      postgres
      discord
      node
    }
  }
`;

interface IntegrationType {
  getIntegrations: {
    intercom: boolean;
    segment: boolean;
    postgres: boolean;
    discord: boolean;
    node: boolean;
  };
}

interface Options {
  pollingInterval?: number;
}

export const useDidIntegrate = (options?: Options) => {
  const { loading, error, data: integrations } = useQuery<IntegrationType>(
    GET_INTEGRATIONS,
    {
      fetchPolicy: "no-cache",
      pollInterval: options?.pollingInterval,
    }
  );

  const returnIntegrations = !loading && !error && integrations.getIntegrations;

  return { loading, error, integrations: returnIntegrations };
};
