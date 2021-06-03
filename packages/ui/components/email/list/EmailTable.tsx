import gql from "graphql-tag";
import { GridRowParams } from "@material-ui/data-grid";
import { useRouter } from "next/router";
import moment from "moment";
import { EmailType } from "pages/emails/[id]";
import { useMemo, useState } from "react";
import ServerPaginatedTable from "components/ServerPaginatedTable";

export const GET_EMAILS = gql`
  query GetEmails {
    emails {
      page
      rows
      nodes {
        id
        name
        from
        fromName
        bodyHtml
        subject
        sentCount
        createdAt
        updatedAt
      }
    }
  }
`;

const columns = [
  {
    field: "name2",
    headerName: "Name",
    width: 200,
    valueGetter: (params) => params.getValue("name") ?? "Untitled",
  },
  {
    field: "subject",
    headerName: "Subject",
    // description: "This column has a value getter and is not sortable.",
    width: 300,
  },
  {
    field: "draft",
    headerName: "Draft",
    width: 100,
    valueGetter: (params) =>
      params.getValue("sentCount") > 0 ? "Published" : "Draft",
  },
  {
    field: "sentCount2",
    headerName: "Sent To",
    // description: "This column has a value getter and is not sortable.",
    width: 200,
    valueGetter: (params) => params.getValue("sentCount") ?? "-",
  },
  {
    field: "createdAtFormatted",
    headerName: "Created",
    type: "string",
    width: 180,
    valueGetter: (params) =>
      moment(params.getValue("createdAt")).format("MMMM DD, YYYY"),
  },
];

interface EmailTableProps {
  onClick?: (email: EmailType) => void;
}

const EmailTable = (props?: EmailTableProps) => {
  const router = useRouter();
  const [emails, setEmails] = useState<any>();

  const onClick = useMemo(
    () => (param: GridRowParams) => {
      const id = param.id;
      const email = emails.emails.nodes.find((elem) => elem.id === id);
      if (!email) {
        return;
      }
      if (props?.onClick) {
        props.onClick(email);
      } else {
        router.push(`/emails/${id}`);
      }
    },
    [emails]
  );

  return (
    <ServerPaginatedTable
      columns={columns}
      gql={GET_EMAILS}
      getRows={(data) => {
        setEmails(data);
        return data.emails.nodes;
      }}
      queryOptions={{ fetchPolicy: "no-cache" }}
      onRowClick={onClick}
    />
  );
};

export default EmailTable;
