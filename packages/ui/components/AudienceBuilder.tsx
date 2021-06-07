import { useRef, useState } from "react";
import { Condition, NodeParseError, parse, serialize } from "common/filters";
import BlueButton from "./BlueButton";
import RenderCondition from "./audience/RenderCondition";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { CircularProgress, makeStyles } from "@material-ui/core";
import ProductUserTable from "./UserTable";
import { useRouter } from "next/router";

interface Props {
  id?: string;
  rootNode: Condition;
  name: string;
}

const EXECUTE_AUDIENCE = gql`
  mutation ExecuteAudience($audience: String) {
    executeAudience(audience: $audience) {
      page
      rows
      nodes {
        id
        firstName
        lastName
        email
        photo
        phone
        signedUpAt
        lastSeenAt
        browser
        browserVersion
        browserLanguage
        os
        country
        region
        city
        title
        websiteUrl
        companyName
        industry
        intercomId
        externalId
      }
    }
  }
`;

const CREATE_AUDIENCE = gql`
  mutation CreateAudience($name: String!, $node: String!) {
    createAudience(name: $name, node: $node) {
      id
      name
      node
      count
      createdAt
      updatedAt
      executedAt
    }
  }
`;

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
    margin: 0,
    marginBottom: 8,
    "& .MuiInputBase-root": {
      borderRadius: 7,
      width: "25ch",
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 6,
      border: "1px solid #C4C4C4",
      "& .Mui-focused": {
        border: "2px solid #3B6FAB",
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
      },
    },
    "& .MuiInputBase-root:hover": {
      border: "2px solid #4480C5",
      paddingTop: 3,
      paddingBottom: 3,
      paddingLeft: 5,
    },
    "& .MuiInputBase-input MuiInput-input": {
      borderRadius: 7,
      width: "25ch",
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 6,
      border: "1px solid #C4C4C4",
    },
  },
  input: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 0,
    fontFamily: "IBM Plex Sans",
    border: "none",
  },
  adornment: {
    color: "#A3A3A3",
  },
  table: {
    fontFamily: "IBM Plex Sans",
    "& .MuiDataGrid-colCell": {
      textTransform: "uppercase",
      color: "#4E4F55",
    },
    "& .MuiDataGrid-colCellRight": {
      border: "none",
    },
    "& .MuiTypography-body2": {
      fontFamily: "IBM Plex Sans",
    },
  },
  tableHeader: {
    textTransform: "uppercase",
    color: "white",
  },
}));

const AudienceBuilder = (props: Props) => {
  const rootNode = useRef(props.rootNode);
  const [parseErrors, setParseErrors] = useState<NodeParseError[]>([]);
  const [
    executeAudienceQuery,
    {
      data: executeAudienceData,
      loading: executeAudienceLoading,
      error: executeAudienceError,
    },
  ] = useMutation(EXECUTE_AUDIENCE);
  const [
    createAudience,
    {
      data: createAudienceData,
      loading: createAudienceLoading,
      error: createAudienceError,
    },
  ] = useMutation(CREATE_AUDIENCE);
  const [didExecute, setDidExecute] = useState(false);
  const [serializedAudienceData, setSerializedAudienceData] = useState("");
  const showSave = didExecute && !!!executeAudienceError;
  const router = useRouter();

  const onClickExecuteAudience = () => {
    const errors: NodeParseError[] = [];
    parse(rootNode.current, errors);
    if (errors.length) {
      setParseErrors(errors);
      return;
    }
    const serializedData = serialize(rootNode.current);
    const serializedDataAsString = JSON.stringify(serializedData);
    setSerializedAudienceData(serializedDataAsString);
    executeAudienceQuery({
      variables: {
        audience: serializedDataAsString,
      },
    });
    setDidExecute(true);
  };

  const onSaveAudience = () => {
    createAudience({
      variables: {
        name: props.name,
        node: serializedAudienceData,
      },
    }).then((res) => {
      router.push("/audiences/" + res.data.createAudience.id);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h3>AUDIENCE CONDITIONS</h3>
      <RenderCondition
        node={rootNode.current}
        depth={0}
        remove={() => {}}
        errors={parseErrors}
      />
      <div>
        <BlueButton
          text={
            executeAudienceLoading ? (
              <>
                <CircularProgress
                  size={14}
                  color={"white" as any}
                  style={{ marginRight: 2 }}
                />{" "}
                Query Users
              </>
            ) : (
              "Query Users"
            )
          }
          disabled={executeAudienceLoading}
          style={{
            marginLeft: 0,
          }}
          onClick={onClickExecuteAudience}
        />
      </div>
      {executeAudienceData?.executeAudience?.nodes && (
        <ProductUserTable
          productUsers={executeAudienceData.executeAudience.nodes}
          rows={executeAudienceData.executeAudience.rows}
        />
      )}
      {showSave && (
        <BlueButton
          text="Save Audience"
          disabled={createAudienceLoading}
          onClick={onSaveAudience}
        ></BlueButton>
      )}
      {createAudienceError && <p>{createAudienceError.message}</p>}
      <style jsx>
        {`
          h3 {
            margin-block-start: 0px;
            margin-block-end: 1em;
            color: #4e4f55;
            font-weight: 600;
          }
        `}
      </style>
    </div>
  );
};

export default AudienceBuilder;
