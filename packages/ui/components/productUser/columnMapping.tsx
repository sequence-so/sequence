import { GridColumns } from "@material-ui/data-grid";
import moment from "moment";

const DEFAULT_WIDTH = 150;

export const PRODUCT_USER_COLUMN_MAPPING: GridColumns = [
  {
    field: "firstName",
    headerName: "First Name",
    width: DEFAULT_WIDTH,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: DEFAULT_WIDTH,
  },
  {
    field: "email",
    headerName: "Email",
    width: DEFAULT_WIDTH,
  },
  {
    field: "photo",
    headerName: "Photo",
    width: DEFAULT_WIDTH,
  },
  {
    field: "signedUpAt",
    headerName: "Signed Up At",
    width: DEFAULT_WIDTH,
    renderCell: (params) => (
      <span>
        {params.row.signedUpAt
          ? moment((params.row as any).signedUpAt as string).fromNow()
          : ""}
      </span>
    ),
  },
  {
    field: "updatedAt",
    headerName: "Last Seen At",
    width: DEFAULT_WIDTH,
    renderCell: (params) => (
      <span>
        {params.row.signedUpAt
          ? moment((params.row as any).updatedAt as string).fromNow()
          : ""}
      </span>
    ),
  },
  {
    field: "browser",
    headerName: "Browser",
    width: DEFAULT_WIDTH,
  },
  {
    field: "browserVersion",
    headerName: "Browser Version",
    width: DEFAULT_WIDTH,
  },
  {
    field: "browserLanguage",
    headerName: "Browser Language",
    width: DEFAULT_WIDTH,
  },
  {
    field: "os",
    headerName: "Operating System",
    width: DEFAULT_WIDTH,
  },
  {
    field: "country",
    headerName: "Country",
    width: DEFAULT_WIDTH,
  },
  {
    field: "region",
    headerName: "Region",
    width: DEFAULT_WIDTH,
  },
  {
    field: "city",
    headerName: "City",
    width: DEFAULT_WIDTH,
  },
  {
    field: "title",
    headerName: "Title",
    width: DEFAULT_WIDTH,
  },
  {
    field: "websiteUrl",
    headerName: "Website URL",
    width: DEFAULT_WIDTH,
  },
  {
    field: "companyName",
    headerName: "Company Name",
    width: DEFAULT_WIDTH,
  },
  {
    field: "industry",
    headerName: "Industry",
    width: DEFAULT_WIDTH,
  },
  {
    field: "intercomId",
    headerName: "Intercom ID",
    width: DEFAULT_WIDTH,
  },
  {
    field: "externalId",
    headerName: "External ID",
    width: DEFAULT_WIDTH,
  },
];
