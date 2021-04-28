import { useEffect, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/router";
import classnames from "classnames";
import Link from "next/link";
import { DataGrid } from "@material-ui/data-grid";
import MenuItem from "@material-ui/core/MenuItem";
import MaterialSelect from "@material-ui/core/Select";
import Editor from "@monaco-editor/react";

import styles from "../styles/Home.module.css";
import onboardingStyles from "../pages/onboarding/onboarding.module.css";
import BlueButton from "./BlueButton";
import Plus from "./Plus";
import RedCross from "./RedCross";
import { defaultProp } from "../services/defaultProp";
import SQLEditor, { QueryResult } from "./SQLEditor";

interface Props {
  nextRoute: string;
  renderSkip?: boolean;
  renderHeader?: boolean;
}

const constructColumns = (query: QueryResult) => {
  return query?.fields.map(({ name, format }) => ({
    field: name,
    headerName: name,
    width: 150,
    sortable: true,
  }));
};

interface Column {
  field: string;
  headerName: string;
  width: number;
  sortable: boolean;
}
const CreateAlertContent = (props: Props) => {
  const router = useRouter();
  const [state, setState] = useState<"none" | "activity" | "sql">("none");
  const [executedQuery, setExecutedQuery] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const renderSkip = defaultProp(props.renderSkip, true);
  const renderHeader = defaultProp(props.renderHeader, true);
  const [columns, setColumns] = useState<
    {
      field: string;
      headerName: string;
      width: number;
      sortable: boolean;
    }[]
  >([]);
  const [data, setData] = useState([]);
  const [selectedPrimaryKey, setPrimaryKey] = useState<Column>();
  const [selectedAggKey, setAggKey] = useState<Column>();

  useEffect(() => {
    if (queryResult) {
      const columns = constructColumns(queryResult);
      setColumns(columns);
      queryResult.rows.forEach((elem, idx) => {
        elem.id = idx;
      });
      setData(queryResult.rows);
    }
  }, [queryResult]);

  return (
    <>
      {renderHeader && (
        <>
          <h1>Create an Alert</h1>
          <p style={{ marginBlockStart: 0 }}>
            Choose a source to trigger an alert from.
          </p>
        </>
      )}

      <div className={onboardingStyles.actions}>
        <div
          className={classnames(
            onboardingStyles.trigger,
            state === "activity" ? onboardingStyles.trigger_active : null
          )}
          onClick={(): void => {
            if (state === "activity") {
              setState("none");
            } else {
              setState("activity");
            }
          }}
        >
          <div className={onboardingStyles.icon}>
            <svg
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.7715 23.3656C12.0438 23.253 10.3849 22.6457 8.99274 21.6162C7.60057 20.5868 6.53389 19.1787 5.9199 17.5598C5.30591 15.9409 5.17053 14.1795 5.5299 12.4858C5.88927 10.7921 6.72824 9.23744 7.94673 8.00735C9.16522 6.77726 10.7118 5.92361 12.4021 5.5482C14.0923 5.17279 15.8549 5.29148 17.4795 5.8901C19.1042 6.48873 20.5223 7.54202 21.5649 8.92437C22.6075 10.3067 23.2305 11.9598 23.3595 13.6864L21.1994 13.8478C21.1013 12.5356 20.6279 11.2793 19.8355 10.2287C19.0431 9.17813 17.9653 8.37763 16.7306 7.92267C15.4958 7.46772 14.1563 7.37752 12.8717 7.66282C11.5871 7.94813 10.4117 8.59691 9.48567 9.53178C8.55962 10.4667 7.92201 11.6482 7.64888 12.9354C7.37576 14.2226 7.47865 15.5612 7.94528 16.7916C8.41191 18.022 9.22259 19.0922 10.2806 19.8745C11.3387 20.6569 12.5994 21.1184 13.9125 21.2041L13.7715 23.3656Z"
                fill={state === "activity" ? "white" : "#9FA1A4"}
              />
              <path
                d="M13.386 28.6849C10.6378 28.4983 8.00125 27.5251 5.79084 25.8814C3.58043 24.2378 1.88945 21.993 0.919551 19.4149C-0.0503438 16.8367 -0.25821 14.034 0.320744 11.341C0.899698 8.64797 2.24104 6.17831 4.18479 4.22655C6.12854 2.27479 8.59266 0.923303 11.2833 0.333277C13.9739 -0.25675 16.7774 -0.0604137 19.3595 0.898868C21.9417 1.85815 24.1934 3.53989 25.8461 5.74352C27.4988 7.94715 28.4829 10.5797 28.6808 13.3271L26.5911 13.4776C26.422 11.1311 25.5816 8.88271 24.17 7.00061C22.7584 5.11852 20.8353 3.68216 18.6299 2.86285C16.4245 2.04354 14.0301 1.87585 11.7321 2.37979C9.43403 2.88372 7.32945 4.03801 5.66932 5.70499C4.00918 7.37196 2.86356 9.48127 2.36908 11.7813C1.8746 14.0814 2.05214 16.4752 2.88052 18.6772C3.70889 20.8791 5.15315 22.7963 7.04103 24.2002C8.92891 25.604 11.1807 26.4352 13.528 26.5946L13.386 28.6849Z"
                fill={state === "activity" ? "white" : "#9FA1A4"}
              />
              <path
                d="M18.957 28.4394L14.9479 16.2519C14.6973 15.4901 15.4004 14.758 16.1717 14.9776L28.279 18.4254C28.9966 18.6298 29.2458 19.5196 28.7387 20.0669L26.3298 22.6666L31.4802 27.817C31.869 28.2057 31.871 28.8354 31.4848 29.2266L29.4542 31.2836C29.0644 31.6785 28.4277 31.6805 28.0354 31.2882L23.0035 26.2563L20.6404 28.8066C20.1226 29.3654 19.195 29.1631 18.957 28.4394Z"
                fill={state === "activity" ? "white" : "#9FA1A4"}
              />
            </svg>
          </div>
          <div className={onboardingStyles.content}>
            <h4>Activity Based Trigger</h4>
            <p>Listen for product events and trigger an alert.</p>
          </div>
        </div>
        <div
          className={classnames(
            onboardingStyles.trigger,
            state === "sql" ? onboardingStyles.trigger_active : null
          )}
          onClick={(): void => {
            if (state === "sql") {
              setState("none");
            } else {
              setState("sql");
            }
          }}
        >
          <div className={onboardingStyles.icon}>
            <p
              style={{
                fontFamily: "IBM Plex Sans Condensed",
                color: state === "sql" ? "white" : "#F271C6",
                fontWeight: 700,
              }}
            >
              SQL
            </p>
          </div>
          <div className={onboardingStyles.content}>
            <h4>SQL Based Trigger (Advanced)</h4>
            <p>Write a SQL script that will trigger an alert.</p>
          </div>
        </div>
      </div>
      <hr />
      {state === "activity" ? (
        <div className="activity-content">
          <p className={styles.subtitle}>CHOOSE AN EVENT</p>
          <p>
            When
            <Select
              options={[
                { value: "phone_verified", label: "Phone Verified" },
                { value: "user_signup", label: "User Signup" },
                {
                  value: "onboarding_clicked",
                  label: "Onboarding Clicked",
                },
                {
                  value: "credit_card_added",
                  label: "Credit Card Added",
                },
                { value: "teammate_invited", label: "Teammate Invited" },
                {
                  value: "integration_added",
                  label: "Integration Added",
                },
              ]}
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: 200,
                  outline: "none",
                  background: "white",
                  "&:hover": {
                    cursor: "pointer",
                  },
                  display: "inline-block",
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 10,
                }),
              }}
            ></Select>
            is performed, alert me if
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginLeft: "2rem",
            }}
          >
            <RedCross
              visible={true}
              onClick={(): void => {}}
              style={{ marginRight: "4px" }}
            />
            <input value="email"></input>
            <Select
              options={[
                { value: "contains", label: "contains" },
                { value: "does not contain", label: "does not contain" },
                { value: "equals", label: "equals" },
                { value: "is not", label: "is not" },
                { value: ">", label: ">" },
                { value: "<", label: "<" },
                { value: ">=", label: ">=" },
                { value: "<=", label: "<=" },
              ]}
              defaultValue={{ value: "contains", label: "contains" }}
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: 200,
                  outline: "none",
                  background: "white",
                  "&:hover": {
                    cursor: "pointer",
                  },
                  display: "inline-block",
                  marginLeft: 10,
                  marginRight: 10,
                }),
              }}
            ></Select>
            <input value="figma.com"></input>
          </div>
          <div className="add-condition-wrapper" onClick={(): void => {}}>
            <Plus visible={true} onClick={(): void => {}} />
            <span className="add-condition">ADD CONDITION</span>
          </div>
        </div>
      ) : state === "sql" ? (
        <>
          <p className={styles.subtitle}>CONFIGURE A SCRIPT</p>
          <p>
            Your SQL script must contain at least one primary key and at least
            one numeric value (like a count).{" "}
          </p>
          <SQLEditor
            onExecutedQuery={(code: string) => {
              setExecutedQuery(true);
            }}
            onQueryResult={(result: QueryResult) => {
              setQueryResult(result);
            }}
          />
          {executedQuery && data.length > 0 && (
            <>
              <div style={{ height: 400, width: "80%" }}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={20}
                  density="compact"
                />
              </div>
              <p className={styles.subtitle}>CONFIGURE A SCRIPT</p>
              <div className={onboardingStyles.well}>
                <p>
                  Primary key is{" "}
                  <MaterialSelect
                    labelId="demo-simple-select-label"
                    value={selectedPrimaryKey}
                    onChange={({ target: { value } }): void => {
                      setPrimaryKey(
                        columns.find((elem) => elem.field === value)
                      );
                    }}
                  >
                    {columns.map(({ field }) => (
                      <MenuItem key={field} value={field}>
                        {field}
                      </MenuItem>
                    ))}
                  </MaterialSelect>
                  .
                </p>
                <p>
                  Alert me when{" "}
                  <MaterialSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedAggKey}
                    onChange={({ target: { value } }): void => {
                      setAggKey(columns.find((elem) => elem.field === value));
                    }}
                  >
                    {columns.map(({ field }) => (
                      <MenuItem key={field} value={field}>
                        {field}
                      </MenuItem>
                    ))}
                  </MaterialSelect>{" "}
                  changes by{" "}
                  <MaterialSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={"more than 1"}
                    onChange={(): void => {}}
                  >
                    <MenuItem value={"more than 1"}>more than 1</MenuItem>
                  </MaterialSelect>{" "}
                  over a duration of{" "}
                  <MaterialSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={"5 minutes"}
                    onChange={(): void => {}}
                  >
                    <MenuItem value={"5 minutes"}>5 minutes</MenuItem>
                  </MaterialSelect>
                  .
                </p>
              </div>
            </>
          )}
        </>
      ) : null}

      {renderSkip && (
        <p className={styles.not_ready_text}>
          Not ready?{" "}
          <Link href="/onboarding/done">
            <span className={styles.bold_text}>Click here to Skip</span>
          </Link>
        </p>
      )}
      <BlueButton
        text="Next"
        onClick={(): void => {
          router.push(props.nextRoute);
        }}
        style={{
          display:
            state === "sql" ? (!selectedAggKey ? "none" : "flex") : "initial",
        }}
      />
      <style jsx>{`
        .activity-content {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .activity-content > p {
          margin-block-start: 1rem;
          margin-block-end: 0px;
        }

        input {
          padding: 2px 8px;
          min-height: 38px;
          font-family: "IBM Plex Sans";
          font-size: 1rem;
        }

        .add-condition {
          margin-left: 8px;
        }
        .add-condition-wrapper {
          cursor: pointer;
          display: inline-flex;
          margin-left: 2rem;
          margin-top: 1rem;
        }
        .add-condition-wrapper:hover {
          background: #888888;
          max-width: 180px;
          padding: 6px 8px;
          margin-top: 10px;
          margin-left: calc(2rem - 8px);
          margin-bottom: -6px;
          border-radius: 4px;
        }
        .add-condition:hover {
          cursor: pointer;
          color: white;
        }
      `}</style>
    </>
  );
};

export default CreateAlertContent;
