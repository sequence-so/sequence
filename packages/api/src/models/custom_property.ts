import { ColumnDescription, InitOptions } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import SequelizeAuto from "sequelize-auto";
const auto = new SequelizeAuto(sequelize, null, null, {
  noWrite: true,
  directory: "./",
  singularize: true,
  tables: ["custom_properties"],
  closeConnectionAutomatically: false,
});

const config: InitOptions = {
  tableName: "custom_property",
  sequelize,
  paranoid: true,
};

export type TableDefinition = Record<string, ColumnDescription>;
let tableDefinition: TableDefinition = null;

export const getTableDefinition = (): TableDefinition => {
  return tableDefinition;
};

const setTableDefinition = (definition: TableDefinition) => {
  tableDefinition = definition;
};

const readTableFromDatabase = async () => {
  const tableDefinitions = await auto.run();
  if (tableDefinitions.tables["public.custom_properties"]) {
    setTableDefinition(tableDefinitions.tables["public.custom_properties"]);
    CustomProperty.init(
      tableDefinitions.tables["public.custom_properties"],
      config
    );
  } else {
    // no init for now
  }
};

export class CustomProperty extends Model {
  public id: string;
  public event_id: string;
}

readTableFromDatabase();

export default CustomProperty;
