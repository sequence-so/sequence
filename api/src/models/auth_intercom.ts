import { InitOptions, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user";

const config: InitOptions = {
  tableName: "auth_intercom",
  sequelize,
  paranoid: true,
};

class AuthIntercom extends Model {
  public id: string;
  public code: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuthIntercom.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    code: {
      type: STRING,
    },
  },
  config
);

AuthIntercom.belongsTo(User, {
  as: "user",
});

export default AuthIntercom;
