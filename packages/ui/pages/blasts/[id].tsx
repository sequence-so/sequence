import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import DashboardLayout from "layout/DashboardLayout";
import TitleBar from "layout/TitleBar";
import ProductUserTable from "components/UserTable";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import DynamicTitleBar from "components/DynamicTitleBar";
import DefaultViewLayout from "layout/DefaultViewLayout";
import Link from "next/link";
import ServerPaginatedTable from "components/ServerPaginatedTable";
import homeStyles from "styles/Home.module.css";
import moment from "moment";
import { GridCellParams } from "@material-ui/data-grid";
import GQLErrorMessage from "components/GQLErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { PAGE_DEFAULTS } from "constants/page";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

export const GET_BLAST = gql`
  query GetBlast($id: ID) {
    blasts(id: $id) {
      page
      rows
      nodes {
        id
        name
        sentAt
        userId
        emailId
        audience {
          productUsers {
            id
            firstName
            lastName
            email
            createdAt
            lastSeenAt
          }
        }
        audienceId
        createdAt
        updatedAt
      }
    }
  }
`;

export const columns = [
  {
    field: "full_name",
    headerName: "User",
    width: 200,
    renderCell: (params: GridCellParams) => (
      <Link href={`/explorer/${params.row.id}`}>
        <a>
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <div className={homeStyles.initials_circle}>
              {(params.row.firstName as any).substring(0, 1)}
              {(params.row.lastName as any)?.substring(0, 1)}
            </div>
            {params.row.firstName as any} {params.row.lastName as any}
          </div>
        </a>
      </Link>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 150,
    valueGetter: (params) => moment(params.row.createdAt).fromNow(),
  },
  {
    field: "lastSeenAt",
    headerName: "Last Seen At",
    width: 150,
    valueGetter: (params) => moment(params.row.lastSeenAt).fromNow(),
  },
];

const BlastByIdPage = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_BLAST, {
    variables: {
      id: router.query.id,
    },
  });
  const content = loading ? (
    <CircularProgress />
  ) : error ? (
    <GQLErrorMessage error={error.message} />
  ) : (
    <>
      <div className="relations">
        <Link href={`/emails/${data.campaigns.nodes[0].emailId}`}>
          <a>
            <div className="relation">
              <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
              <span>View Email</span>
            </div>
          </a>
        </Link>
        <Link href={`/audiences/${data.campaigns.nodes[0].audienceId}`}>
          <a>
            <div className="relation">
              <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
              <span>View Audience</span>
            </div>
          </a>
        </Link>
      </div>
      <h4>SENT TO:</h4>
      <ServerPaginatedTable
        variables={{ id: router.query.id }}
        gql={GET_BLAST}
        columns={columns}
        getRows={(data) => data.campaigns.nodes[0].audience.productUsers}
      />
      <style jsx>{`
        h4 {
          margin-block-start: 1em;
          margin-block-end: 1em;
          color: #4e4f55;
          font-weight: 600;
        }
        .relations {
          display: flex;
          flex-direction: row;
          margin-top: 1em;
        }
        .relation {
          display: flex;
          border: var(--border-grey);
          border-radius: 4px;
          padding: 1em;
          cursor: pointer;
          flex-grow: 1;
        }
        .relation:hover {
          box-shadow: var(--subtle-shadow);
        }
        .relations > a {
          display: flex;
          flex-grow: 1;
        }
        .relation > span {
          margin-left: 10px;
        }
        .relations > * + * {
          margin-left: 1em;
        }
      `}</style>
    </>
  );

  return (
    <DashboardLayout index={0}>
      <DefaultViewLayout>
        <>
          <DynamicTitleBar
            title={data?.campaigns?.nodes[0].name}
            onChangeTitleText={(text: string) => {}}
            subtitle={PAGE_DEFAULTS.blasts.id.subtitle}
            showAction={false}
          />
          {content}
        </>
      </DefaultViewLayout>
    </DashboardLayout>
  );
};

export default dynamic(() => Promise.resolve(BlastByIdPage), { ssr: false });
