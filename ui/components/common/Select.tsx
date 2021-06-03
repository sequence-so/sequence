import Select, { Props } from "react-select";

const CommonSelect = (props: Props) => {
  return (
    <Select
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
          marginRight: 10,
          marginBottom: 10,
        }),
      }}
      {...props}
    />
  );
};

export default CommonSelect;
