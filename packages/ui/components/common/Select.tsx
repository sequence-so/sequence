import ReactSelect, { Props } from "react-select";
import CreatableSelect from "react-select/creatable";

interface SelectProps extends Props {
  containerWidth?: number | string;
}

const styles = (props: SelectProps) => {
  return {
    container: (provided) => ({
      ...provided,
      width: props.containerWidth || 200,
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
};

const Select = (props: SelectProps) => {
  return <ReactSelect styles={styles(props)} {...props} />;
};

export const Createable = (props: SelectProps) => {
  return <CreatableSelect styles={styles(props)} {...props} />;
};

export default Select;
