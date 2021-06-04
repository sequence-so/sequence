import Select from "react-select";
import { Condition } from "common/filters";
import { SELECT_OPTIONS } from "./AudienceConstants";

export interface CreateFilterProps {
  addChild: (id: string) => void;
  parent: Condition;
}

export const CreateFilter = (props: CreateFilterProps) => {
  return (
    <Select
      options={SELECT_OPTIONS}
      onChange={({ value }): void => {
        props.addChild(value as string);
      }}
      placeholder="Add condition or filter"
      controlShouldRenderValue={false}
      styles={{
        container: (provided) => ({
          ...provided,
          width: 240,
          outline: "none",
          background: "white",
          "&:hover": {
            cursor: "pointer",
          },
          display: "inline-block",

          marginRight: 10,
          marginBottom: 10,
        }),
      }}
    />
  );
};
