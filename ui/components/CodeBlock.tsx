import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyDefault from "../public/copy_default.svg";
import CopySuccess from "../public/copy_success.svg";
import { useState } from "react";
import { defaultProp } from "../services/defaultProp";

interface Props {
  text: string | JSX.Element;
  copyable?: boolean;
}

const CodeBlock = (props: Props) => {
  const [copied, setCopied] = useState(false);
  const copyable = defaultProp(props.copyable, true);

  return (
    <>
      <code className={"code_block"}>
        <div className="code_block_content">{props.text}</div>

        {copyable && (
          <CopyToClipboard
            text={props.text}
            onCopy={(): void => {
              setCopied(true);
            }}
          >
            {copied ? (
              <img src={CopySuccess} width={24}></img>
            ) : (
              <img src={CopyDefault} width={24}></img>
            )}
          </CopyToClipboard>
        )}
      </code>
      <style jsx>{`
        .code_block {
          display: inline-flex;
          padding: 1rem 1rem;
          background-color: #ebebeb;
          border-radius: 8px;
          text-overflow: clip;
          width: 100%;
        }

        .code_block_content {
          display: block;
        }

        .code_block > img {
          margin-top: auto;
          margin-bottom: auto;
          margin-left: auto;
          padding-left: 4px;
          padding-right: 4px;
          cursor: pointer;
        }

        .code_block > span {
          display: inline-flex;
          width: 100%;
        }
        .code_block > img:hover {
          background: #c4c4c4;
          border-radius: 2px;
        }

        .code_block > p {
          text-overflow: clip;
          overflow: hidden;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
};

export default CodeBlock;
