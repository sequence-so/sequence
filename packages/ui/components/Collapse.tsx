import CollapseIconDefault from "public/collapse_icon.svg";
import MouseBlockIcon from "./MouseBlockIcon";

interface Props {
  onClick: () => void;
}

const Collapse = (props: Props) => {
  return <MouseBlockIcon image={CollapseIconDefault} onClick={props.onClick} />;
};

export default Collapse;
