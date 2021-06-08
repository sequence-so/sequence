import Select, { Props } from "react-select";
import CreatableSelect from "react-select/creatable";

const styles = {
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
};

const CommonSelect = (props: Props) => {
  return <Select styles={styles} {...props} />;
};

export const Createable = (props: Props) => {
  return <CreatableSelect styles={styles} {...props} />;
};

export default CommonSelect;
