import { useMutation } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import gql from "graphql-tag";
import { useEffect } from "react";
import CodeBlock from "../../../components/CodeBlock";
import FloatingProgress from "../../../components/FloatingProgress";
import { useDidIntegrate } from "../../../hooks/useDidIntegrate";
import IntegrationLayout from "../../../layout/IntegrationLayout";

const CREATE_SEQUENCE_WEBHOOK = gql`
  mutation createSequenceWebhook {
    createSequenceWebhook {
      id
      token
    }
  }
`;
interface SequenceWebhook {
  createSequenceWebhook: {
    id: string;
    token: string;
  };
}

const NodeSDKPage = () => {
  const [
    createWebhook,
    { loading, data, error },
  ] = useMutation<SequenceWebhook>(CREATE_SEQUENCE_WEBHOOK);
  const { integrations, loading: loadingIntegrations } = useDidIntegrate({
    pollingInterval: 1000,
  });
  console.log(integrations, loading);

  useEffect(() => {
    createWebhook();
  }, []);

  return (
    <IntegrationLayout
      thumbnail="/node_js.svg"
      name="node"
      title="Node SDK"
      authorization={null}
      content={
        <>
          <p>
            Need custom integration with Sequence? Use our Node SDK to both
            capture events from your backend and trigger alerts.
          </p>
          <p>
            For more instructions on how to integrate with our SDK, click here
            for the Github link.
          </p>
        </>
      }
      instructions={
        <div style={{ textAlign: "left", width: "100%" }}>
          <h2>Installation</h2>
          <p>
            To start with the integration, install the library in your Node
            project:
          </p>
          <CodeBlock text={"yarn install @sequence/node\n"}></CodeBlock>
          <p>Add your Sequence to your environment configuration: </p>
          {loading && <CircularProgress></CircularProgress>}
          {error && (
            <p>An error occurred loading your token: {error.message}</p>
          )}
          {data && (
            <CodeBlock
              text={`SEQUENCE_API_KEY=${data.createSequenceWebhook.token}`}
            ></CodeBlock>
          )}
          <p>Configure your SDK:</p>
          <CodeBlock
            text={
              <>
                <span>{`import Sequence from '@sequence/node';`}</span>
                <br />
                <br />
                <span>{`let sequence = new Sequence(process.env.SEQUENCE_API_KEY);`}</span>
                <br />
                <br />
                <span>{`sequence.alert(user.id, 'My Event Name', {`}</span>
                <br />
                <span>&ensp;{`message: "Tom has entered the building",`}</span>
                <br />
                <span>&ensp;{`data: {`}</span>
                <br />
                <span>&ensp;&ensp;{`  firstName: "Tom",`}</span>
                <br />
                <span>&ensp;&ensp;{`  lastName: "Cruise"`}</span>
                <br />
                <span>&ensp;{`}`}</span>
                <br />
                <span>{`}`}</span>
                <br />
              </>
            }
          ></CodeBlock>
          {!loadingIntegrations && integrations && (
            <FloatingProgress
              status={integrations.node ? "green" : "yellow"}
              title="WEBHOOK STATUS"
              text={integrations.node ? "Received data!" : "Waiting on data..."}
            />
          )}
        </div>
      }
    />
  );
};

export default NodeSDKPage;
