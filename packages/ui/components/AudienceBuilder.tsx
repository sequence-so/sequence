import React, { useState } from "react";
import { Condition, NodeParseError, parse, serialize } from "common/filters";
import BlueButton from "./BlueButton";
import RenderCondition from "./audience/RenderCondition";
import { useMutation } from "@apollo/client";
import { CircularProgress, makeStyles } from "@material-ui/core";
import ProductUserTable from "./ProductUserTable";
import { useRouter } from "next/router";
import { defaultProp } from "services/defaultProp";
import { CREATE_AUDIENCE, EXECUTE_AUDIENCE } from "./audience/AudienceQueries";
import {
  ExecuteAudience,
  ExecuteAudienceVariables,
} from "__generated__/ExecuteAudience";
import {
  CreateAudience,
  CreateAudienceVariables,
} from "__generated__/CreateAudience";

interface Props {
  id?: string;
  rootNode: Condition;
  name: string;
  renderQueryButton?: boolean;
  editable?: boolean;
  renderTitle?: boolean;
  onChange?: () => void;
  validateOnBlur?: boolean;
}

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

export type AudienceBuilderContextType = {
  onChange: () => void;
  editable: boolean;
};

export const AudienceBuilderContext =
  React.createContext<AudienceBuilderContextType>({
    onChange: () => {},
    editable: true,
  });

const AudienceBuilder = (props: Props) => {
  const renderQueryButton = defaultProp(props.renderQueryButton, true);
  const editable = defaultProp(props.editable, true);
  const renderTitle = defaultProp(props.renderTitle, true);
  const rootNode = props.rootNode;
  const [parseErrors, setParseErrors] = useState<NodeParseError[]>([]);
  const [
    executeAudienceQuery,
    {
      data: executeAudienceData,
      loading: executeAudienceLoading,
      error: executeAudienceError,
    },
  ] = useMutation<ExecuteAudience, ExecuteAudienceVariables>(EXECUTE_AUDIENCE);
  const [
    createAudience,
    {
      data: createAudienceData,
      loading: createAudienceLoading,
      error: createAudienceError,
    },
  ] = useMutation<CreateAudience, CreateAudienceVariables>(CREATE_AUDIENCE);
  const [didExecute, setDidExecute] = useState(false);
  const [serializedAudienceData, setSerializedAudienceData] = useState("");
  const showSave = didExecute && !!!executeAudienceError;
  const router = useRouter();

  const validate = () => {
    const errors: NodeParseError[] = [];
    parse(rootNode, errors);
    setParseErrors(errors);
    if (errors.length) {
      return false;
    }
    return true;
  };

  const onChange = defaultProp(props.onChange, () => {});
  const internalOnChange = (): void => {
    if (props.validateOnBlur) {
      validate();
    }
    onChange();
  };

  const onClickExecuteAudience = () => {
    if (!validate()) {
      return;
    }
    const serializedData = serialize(rootNode);
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
    <AudienceBuilderContext.Provider
      value={{ onChange: internalOnChange, editable }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {renderTitle && <h3>AUDIENCE RULES</h3>}
        <div className="audience-container">
          <RenderCondition
            node={rootNode}
            depth={0}
            remove={() => {}}
            errors={parseErrors}
          />
        </div>
        <div>
          {renderQueryButton && (
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
          )}
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
            .audience-container {
              width: 100%;
              height: 100%;
            }
            h3 {
              margin-block-start: 0px;
              margin-block-end: 1em;
              color: #4e4f55;
              font-weight: 600;
            }
          `}
        </style>
      </div>
    </AudienceBuilderContext.Provider>
  );
};

export default AudienceBuilder;
