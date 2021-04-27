import { gql, useMutation, useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import Select from "react-select";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import BlueButton from "./BlueButton";

interface Props {
  onExecutedQuery: (code: string) => void;
  onQueryResult: (result: QueryResult) => void;
}

export interface QueryResult {
  command: string;
  fields: { columnID: number; format: string; name: string }[];
  rowCount: number;
  rows: any;
}

const EXECUTE_QUERY = gql`
  mutation ExecuteDatabaseQuery($query: String, $databaseId: String) {
    executeDatabaseQuery(query: $query, databaseId: $databaseId) {
      result
    }
  }
`;

const GET_DATABASES = gql`
  query GetDatabases {
    getDatabases {
      id
      type
      hostname
      username
    }
  }
`;

const SQLEditor = (props: Props) => {
  const [code, setCode] = useState("");
  const [databaseId, setDatabaseId] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [executedQuery, setExecutedQuery] = useState(false);
  const {
    loading: loadingDatabases,
    data: dataDatabases,
    error: errorDatabases,
  } = useQuery(GET_DATABASES);
  const [execute, { loading, data, error }] = useMutation(EXECUTE_QUERY);

  useEffect(() => {
    if (localStorage.codeEditor) {
      setCode(localStorage.codeEditor);
    }
  }, []);

  // console.log({ loading, data, error });
  if (loadingDatabases) {
    return <CircularProgress />;
  }
  if (errorDatabases) {
    return (
      <p>
        An error occured fetching the list of databases:{" "}
        {errorDatabases.message}
      </p>
    );
  }

  if (data && data.executeDatabaseQuery) {
    const result = JSON.parse(data.executeDatabaseQuery.result);
    console.log({ result });
  }
  return (
    <>
      <Select
        options={dataDatabases.getDatabases.map(({ hostname, type, id }) => ({
          label: (type === "postgres" ? "Postgres: " : "Database: ") + hostname,
          value: id,
        }))}
        onChange={(value) => {
          console.log(value);
          setDatabaseId(value);
        }}
        value={databaseId}
        styles={{
          container: (provided) => ({
            ...provided,
            width: 200,
            outline: "none",
            background: "white",
            "&:hover": {
              cursor: "pointer",
            },
            display: "inline-block",
            marginLeft: 10,
            marginRight: 10,
          }),
        }}
      ></Select>
      <div style={{ border: "1px solid grey" }}>
        <Editor
          value={code}
          onChange={(newValue) => {
            setCode(newValue);
            localStorage.codeEditor = newValue;
          }}
          width="500px"
          height="250px"
          defaultLanguage="sql"
          language="sql"
          defaultValue={`SELECT user_id, count(*)\nFROM my_table\nGROUP BY user_id `}
          options={{
            minimap: { enabled: false },
            selectOnLineNumbers: false,
            cursorStyle: "line",
            lineNumbers: "off",
          }}
        />
      </div>
      <BlueButton
        text={
          !loading ? "Execute" : <CircularProgress size={14} color="primary" />
        }
        disabled={databaseId === null || loading}
        onClick={(): void => {
          setExecutedQuery(true);
          props.onExecutedQuery(code);

          execute({
            variables: {
              query: code,
              databaseId: databaseId.value,
            },
          }).then((result) => {
            const parsedData = JSON.parse(
              result.data.executeDatabaseQuery.result
            ) as QueryResult;
            props.onQueryResult(parsedData);
          });
        }}
      />
    </>
  );
};

export default SQLEditor;
