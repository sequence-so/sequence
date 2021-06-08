interface Props {
  children: React.ReactElement;
}

const DefaultViewLayout = (props: Props) => {
  return (
    <>
      <div className="container">{props.children}</div>
      <div className="container-footer" />
      <style jsx>{`
        .container {
          margin-top: 16px;
          display: flex;
          width: 100%;
          height: auto;
          flex-direction: column;
          min-height: 700px;
        }
        .container:last-child {
          padding-bottom: 2em;
        }
      `}</style>
    </>
  );
};

export default DefaultViewLayout;
