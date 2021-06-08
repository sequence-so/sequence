import { makeStyles } from "@material-ui/core";
import { DataGrid, DataGridProps } from "@material-ui/data-grid";
import { useMemo } from "react";

interface TableProps extends DataGridProps {
  shadow?: boolean;
}

const useStyles = makeStyles((theme) => ({
  table: {
    fontFamily: "IBM Plex Sans",
    "&": {
      boxShadow: (props) =>
        (props as any).shadow ? "var(--subtle-shadow)" : "none",
      minHeight: 300,
    },
    "& .MuiDataGrid-row:hover": {
      cursor: "pointer",
    },
    "& .MuiDataGrid-colCell": {
      textTransform: "uppercase",
      color: "#4E4F55",
    },
    "& .MuiDataGrid-colCellRight": {
      border: "none",
    },
    "& .MuiTypography-body2": {
      fontFamily: "IBM Plex Sans",
    },
  },
  tableHeader: {
    textTransform: "uppercase",
    color: "white",
  },
}));

const Table = (props: TableProps) => {
  const classes = useStyles({ shadow: props.shadow });

  const className = useMemo(() => classes.table, [classes.table]);
  const components = useMemo(
    () => ({
      ColumnResizeIcon: () => null,
    }),
    []
  );
  const componentProps = useMemo(
    () => ({
      header: {
        className: classes.tableHeader,
      },
    }),
    []
  );

  return (
    <DataGrid
      className={className}
      pagination
      components={components}
      componentsProps={componentProps}
      {...props}
    />
  );
};

export default Table;
