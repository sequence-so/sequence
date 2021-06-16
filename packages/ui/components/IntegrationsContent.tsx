import CircularProgress from "@material-ui/core/CircularProgress";
import { useDidIntegrate } from "hooks/useDidIntegrate";
import styles from "../styles/Home.module.css";
import IntegrationBox from "./IntegrationBox";

const INTEGRATIONS = {
  clientLibraries: {
    title: "Client Libraries",
    value: {
      node: {
        imgProps: {
          src: "/node_js.svg",
          width: 80,
        },
        text: "",
        link: "/onboarding/node-sdk",
      },
    },
  },
  productEvents: {
    title: "Product Events",
    value: {
      segment: {
        imgProps: {
          src: "/segment_icon.svg",
          width: 35,
        },
        text: "Segment",
        link: "/onboarding/segment",
      },
    },
  },
};

const IntegrationsContent = () => {
  const { loading, error, integrations } = useDidIntegrate();
  console.log({ loading, integrations, error });

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <p>An error has occured: {error.message}</p>;
  }

  const RenderIntegrations = Object.keys(INTEGRATIONS).map((key) => {
    const title = INTEGRATIONS[key].title;
    const keysInSection = Object.keys(INTEGRATIONS[key].value);

    const sectionItems = keysInSection.map((integrationKey) => {
      const active = integrations[integrationKey];
      return (
        <IntegrationBox
          key={integrationKey}
          active={active}
          {...INTEGRATIONS[key].value[integrationKey]}
        />
      );
    });

    return (
      <>
        <h3
          style={{
            alignSelf: "flex-start",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          {title}
        </h3>
        <div className={styles.integrations_grid}>{sectionItems}</div>
      </>
    );
  });

  return (
    <>
      <div className="container">{RenderIntegrations}</div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          padding: 1rem;
        }
        h3 {
          margin-block-end: 0rem;
        }
      `}</style>
    </>
  );
};

export default IntegrationsContent;
