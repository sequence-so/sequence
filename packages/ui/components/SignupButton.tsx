import React from "react";

interface Props {
  onClick?: () => {};
  text: string;
  disabled: boolean;
  type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

const SignupButton = React.forwardRef<{}, Props>(
  ({ type, text, onClick, disabled }, ref) => {
    return (
      <button
        type={type}
        className="button"
        onClick={onClick}
        disabled={disabled}
        ref={ref as any}
      >
        <p>{text}</p>
        <style jsx>
          {`
            p {
              margin-block-start: 0.75em;
              margin-block-end: 0.75em;
            }
            .button {
              display: flex;
              border-radius: 4px;
              min-width: 200px;
              color: white;
              margin-top: 1em;
              font-weight: 500;
              background-color: #4e94e5;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              border: none;
            }

            .button:hover {
              background-color: #1a60b2;
              color: white;
              box-shadow: 0px 0px 0px 1px rgba(15, 15, 15, 0.05),
                0px 3px 6px rgba(15, 15, 15, 0.1),
                0px 9px 24px rgba(15, 15, 15, 0.2);
              border-color: none;
            }
          `}
        </style>
      </button>
    );
  }
);

export default SignupButton;
