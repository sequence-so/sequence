import sequence_text from "public/sequence_text.svg";

const Wordmark = () => {
  return (
    <>
      <a href="https://github.com/sequence-so/sequence" target="_blank">
        <img className="wordmark" src={sequence_text} />
      </a>
      <style jsx>{`
        .wordmark {
          margin-top: 2em;
          width: 80px;
          justify-content: flex-end;
        }
      `}</style>
    </>
  );
};

export default Wordmark;
