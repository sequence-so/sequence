import { makeStyles } from "@material-ui/core";
import { DataGrid, DataGridProps } from "@material-ui/data-grid";
import { useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  table: {
    fontFamily: "IBM Plex Sans",
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

const Table = (props: DataGridProps) => {
  const classes = useStyles();

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
