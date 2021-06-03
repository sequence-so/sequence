import dynamic from "next/dynamic";
import { Letter } from "react-letter";

interface Props {
  html: string;
}

const EmailRenderer = (props: Props) => {
  return (
    <div>
      <Letter html={props.html} />
    </div>
  );
};

export default dynamic(() => Promise.resolve(EmailRenderer), { ssr: false });
