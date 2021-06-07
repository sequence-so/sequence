import { ProductUser } from "pages/explorer/index";
import { useMemo } from "react";
import { PRODUCT_USER_COLUMN_MAPPING } from "./columnMapping";

interface Props {
  productUser: ProductUser;
}

const DetailSidebar = (props: Props) => {
  const attributeList = useMemo(
    () =>
      PRODUCT_USER_COLUMN_MAPPING.filter(
        ({ field }) => field !== "firstName" && field !== "lastName"
      ).map((elem) => {
        const field = elem.field;
        const label = elem.headerName;
        const value = props.productUser[field] ? props.productUser[field] : "-";
        let render: JSX.Element = null;
        if (elem.renderCell) {
          render = elem.renderCell({ row: props.productUser } as any);
        }
        return { field, label, value, render };
      }),
    []
  );
  const RenderAttributeList = attributeList.map(
    ({ field, label, value, render }) => {
      return (
        <div key={field}>
          <p className="attribute-label">{label}</p>
          <p className="attribute-value">{render ? render : value}</p>
          <style jsx>{`
            p {
              margin-block-start: 0px;
              margin-block-end: 0px;
            }
            .attribute-label {
              color: #4e4f55;
              font-weight: 600;
              text-transform: uppercase;
            }
            .attribute-value {
              color: #4e4f55;
              margin-block-end: 14px;
            }
          `}</style>
        </div>
      );
    }
  );
  return (
    <div className="sidebar">
      <div className="top">
        <h2>
          {props.productUser.firstName} {props.productUser.lastName}
        </h2>
      </div>
      <div className="line"></div>
      <div className="attributes">{RenderAttributeList}</div>
      <style jsx>{`
        .sidebar {
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: 4px;
          border: var(--border-grey);
          box-shadow: var(--subtle-shadow);
          margin-left: 1em;
        }
        .line {
          width: calc(100% - 4em);
          height: 1px;
          margin-left: 2em;
          margin-right: 2em;
          align-self: center;
          border-top: 2px solid #ededed;
        }
        .top {
          display: flex;
          width: 100%;
          align-items: center;
        }
        h2 {
          font-size: 28px;
          line-height: 36px;
          color: #222325;
          justify-self: center;
          margin-left: auto;
          margin-right: auto;
          font-style: normal;
          font-weight: normal;
          font-size: 28px;
          line-height: 36px;
          color: #222325;
        }
        .attributes {
          display: flex;
          flex-direction: column;
          padding: 1.25em;
          width: 350px;
        }
        p {
          font-size: 18px;
          line-height: 23px;
          color: #4e4f55;
        }
      `}</style>
    </div>
  );
};

export default DetailSidebar;
