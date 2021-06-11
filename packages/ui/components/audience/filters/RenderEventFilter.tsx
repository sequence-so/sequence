import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { EventFilter } from "common/filters";
import { RenderNodeProps } from "../RenderNode";
import { CircularProgress } from "@material-ui/core";
import Select from "components/common/Select";
import { GET_UNIQUE_EVENTS } from "pages/audiences/create";
import { AudienceBuilderContext } from "components/AudienceBuilder";

interface Props extends RenderNodeProps {
  node: EventFilter;
}

const RenderEventFilter = ({ node }: Props) => {
  const audienceBuilderContext = useContext(AudienceBuilderContext);
  const editable = audienceBuilderContext.editable;
  const { data, loading, error } = useQuery(GET_UNIQUE_EVENTS);
  const [eventType, setEventType] = useState<{
    label: string;
    value: string;
  } | null>();
  const [currentValue, setCurrentValue] = useState<{
    label: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    if (data?.uniqueEventNames) {
      const eventName = node.expected;
      if (typeof eventName !== "undefined") {
        setEventType({
          label: eventName,
          value: eventName,
        });
      }
      if (typeof node.performed !== "undefined") {
        const valueOptions = (node as EventFilter).getFilterOptions();
        const key = node.performed ? "hasBeenPerformed" : "hasNotBeenPerformed";
        if (key) {
          const nodeValue = valueOptions.find((e) => e.value === key);
          setCurrentValue(nodeValue);
        }
      }
    }
  }, [data?.uniqueEventNames]);

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <p style={{ color: "red" }}>{error.message}</p>;
  }

  return (
    <>
      <Select
        value={eventType}
        options={data.uniqueEventNames.map((e) => ({ label: e, value: e }))}
        onChange={(event) => {
          setEventType(event);
          node.expected = event.value;
          audienceBuilderContext.onChange();
        }}
        isDisabled={!editable}
      />
      <Select
        value={currentValue}
        options={(node as EventFilter).getFilterOptions()}
        onChange={(option) => {
          const perform = option.value as string;
          node[option.value]();
          setCurrentValue(option);
          audienceBuilderContext.onChange();
        }}
        isDisabled={!editable}
        styles={{
          container: (provided) => ({
            ...provided,
            width: 300,
            outline: "none",
            background: "white",
            "&:hover": {
              cursor: "pointer",
            },
            display: "inline-block",
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 10,
          }),
        }}
      />
    </>
  );
};

export default RenderEventFilter;
