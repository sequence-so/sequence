import classNames from "classnames";
import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";
import { defaultProp } from "services/defaultProp";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  defaultValue?: string;
  value?: string;
  onChangeText?: (value: string) => void;
}

const TitleInput = (props: Props) => {
  const [value, setValue] = useState(defaultProp(props.defaultValue, ""));
  const onChangeText = defaultProp(props.onChangeText, () => {});

  const propsCopy = {
    ...props,
  };
  delete propsCopy.className;
  delete propsCopy.onChangeText;

  return (
    <>
      <input
        className={classNames("name-input", props.className)}
        placeholder="Name this email"
        value={value}
        onChange={(e) => {
          const text = e.target.value;
          setValue(text);
          onChangeText(text);
        }}
        {...propsCopy}
      />
      <style jsx>{`
        .name-input {
          margin-block-start: 17px;
          margin-block-end: 17px;
          height: 37px;
          border: 0;
          font-family: "IBM Plex Sans";
          font-size: 26px;
          font-weight: 500;
          outline: none;
          padding: 0;
          padding-left: 2px;
          width: 100%;
          color: #222325;
        }
        .name-input:hover {
          background-color: #e3e3e3;
        }
        .name-input::placeholder {
          /* Chrome, Firefox, Opera, Safari 10.1+ */
          color: var(--title-input-placeholder);
          opacity: 1; /* Firefox */
        }

        .name-input:-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: var(--title-input-placeholder);
        }

        .name-input::-ms-input-placeholder {
          /* Microsoft Edge */
          color: var(--title-input-placeholder);
        }
      `}</style>
    </>
  );
};

export default TitleInput;
