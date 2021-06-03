import styles from "../styles/Home.module.css";
import classNames from "classnames";

interface Props {
  status: "green" | "yellow";
  title: string;
  text: string;
}

const FloatingProgress = (props: Props) => {
  return (
    <>
      <div className="floating">
        <div
          className={classNames(
            props.status === "yellow"
              ? styles.blinking_circle_anim
              : styles.blinking_circle_green,
            styles.blinking_circle
          )}
        ></div>
        <div className="right">
          <h4>{props.title}</h4>
          <span>{props.text}</span>
        </div>
      </div>
      <style jsx>{`
        .floating {
          position: fixed;
          display: flex;
          align-items: center;
          padding: 0.9rem 1rem;
          bottom: 40px;
          right: 40px;
          width: 15rem;
          height: auto;
          background: white;
          z-index: 100;
          box-shadow: var(--big-box-shadow);
          border-radius: 12px;
        }
        h4 {
          margin-block-start: 0px;
          margin-block-end: 0.25rem;
          color: #888888;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
        .right {
          display: flex;
          flex-direction: column;
          margin-left: 1rem;
        }
      `}</style>
    </>
  );
};

export default FloatingProgress;
