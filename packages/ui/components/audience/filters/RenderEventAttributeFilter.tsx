import { useContext, useEffect, useState } from "react";
import Select, { Createable } from "components/common/Select";
import { EventAttribute } from "common/filters";
import OperatorsSelect from "../OperatorsSelect";
import { RenderNodeProps } from "../RenderNode";
import { useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { GET_UNIQUE_EVENTS } from "pages/audiences/create";
import { AudienceBuilderContext } from "components/AudienceBuilder";

interface Props extends RenderNodeProps {
  node: EventAttribute;
}

const RenderEventAttributeFilter = ({ node }: Props) => {
  const audienceBuilderContext = useContext(AudienceBuilderContext);
  const editable = audienceBuilderContext.editable;
  const { data, loading, error } = useQuery(GET_UNIQUE_EVENTS);
  const [currentValue, setCurrentValue] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [eventType, setEventType] = useState<{
    label: string;
    value: string;
  } | null>();
  useEffect(() => {
    if (data?.uniqueEventNames) {
      const eventName = node.eventName;
      if (typeof eventName !== "undefined") {
        setEventType({
          label: eventName,
          value: eventName,
        });
      }
    }
  }, [data?.uniqueEventNames]);

  useEffect(() => {
    if (node.attribute) {
      setCurrentValue({
        label: node.attribute,
        value: node.attribute,
      });
    }
  }, []);

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
          node.eventName = event.value;
          audienceBuilderContext.onChange();
        }}
        isDisabled={!editable}
      />
      <Createable
        value={currentValue}
        placeholder="Attribute name"
        onChange={(option) => {
          node.attribute = option.value;
          setCurrentValue(option);
          audienceBuilderContext.onChange();
        }}
        isDisabled={!editable}
      />
      <OperatorsSelect editable={editable} node={node} />
    </>
  );
};

export default RenderEventAttributeFilter;
