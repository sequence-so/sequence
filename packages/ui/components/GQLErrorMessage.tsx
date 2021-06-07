interface Props {
  error: string;
}

const GQLErrorMessage = (props: Props) => {
  return (
    <p>
      {props.error}
      <style jsx>{`
        p {
          color: #e44141;
        }
      `}</style>
    </p>
  );
};

export default GQLErrorMessage;
