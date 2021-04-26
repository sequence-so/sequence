import { InitOptions, STRING, UUID, INTEGER } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user";
import { BOOLEAN } from "sequelize";

const config: InitOptions = {
  tableName: "database_query",
  sequelize,
  paranoid: true,
};

class DatabaseQuery extends Model {
  public id: string;
  public database_id: string;
  public database_type: string;
  public query: string;
  public user_id: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DatabaseQuery.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    database_id: {
      type: STRING,
    },
    database_type: {
      type: STRING,
    },
    query: {
      type: STRING,
    },
  },
  config
);

DatabaseQuery.belongsTo(User, {
  as: "user",
});

export default DatabaseQuery;
