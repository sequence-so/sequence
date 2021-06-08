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
  const [createWebhook, { loading, data, error }] =
    useMutation<SequenceWebhook>(CREATE_SEQUENCE_WEBHOOK);
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
          <p>Use our Node SDK to track events and user data.</p>
          <p>
            Using this library allows for both historical import and setting up
            a continuous data stream of incoming events.
          </p>
          <p>This integration provides a client library over our API.</p>
        </>
      }
      instructions={
        <div style={{ textAlign: "left", width: "100%" }}>
          <h2>Documentation</h2>
          <p>
            <a
              className="default"
              href="https://sequence.gitbook.io/sequence/node-sdk/node-sdk"
              target="blank"
            >
              Read our Node SDK documentation here.
            </a>
          </p>
          <h2>Installation</h2>
          <p>Install the library in your Node project:</p>
          <CodeBlock text={"yarn install sequence-node\n"}></CodeBlock>
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
                <span>{`import Sequence from 'sequence-node';`}</span>
                <br />
                <br />
                <span>{`let sequence = new Sequence(process.env.SEQUENCE_API_KEY);`}</span>
                <br />
                <br />
                <span>{`sequence.identify({`}</span>
                <br />
                <span>&ensp;{`userId: "1234-5678-9012",`}</span>
                <br />
                <span>&ensp;{`traits: {`}</span>
                <br />
                <span>&ensp;&ensp;{`  firstName: "Tom",`}</span>
                <br />
                <span>&ensp;&ensp;{`  lastName: "Cruise",`}</span>
                <br />
                <span>&ensp;&ensp;{`  widgetsSold: 5`}</span>
                <br />
                <span>&ensp;{`}`}</span>
                <br />
                <span>{`}`}</span>
                <br />
                <br />
                <span>{`sequence.track({`}</span>
                <br />
                <span>&ensp;{`event: "User Registered",`}</span>
                <br />
                <span>&ensp;{`properties: {`}</span>
                <br />
                <span>&ensp;&ensp;{`  email: "john@smith.com",`}</span>
                <br />
                <span>&ensp;&ensp;{`  age: 55,`}</span>
                <br />
                <span>&ensp;&ensp;{`  companyName: "The Widget Factory"`}</span>
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
