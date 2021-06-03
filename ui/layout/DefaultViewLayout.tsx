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
          height: 100%;
          flex-direction: column;
          min-height: 700px;
        }
        .container:after {
          content: "";
          display: block;
          min-height: 2em;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default DefaultViewLayout;
