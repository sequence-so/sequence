import { InitOptions, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user.model";

const config: InitOptions = {
  tableName: "auth_intercoms",
  sequelize,
  paranoid: true,
};

class AuthIntercom extends Model {
  public id: string;
  public code: string;
  public token: string;
  public user_id: string;
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
    token: {
      type: STRING,
    },
  },
  config
);

AuthIntercom.belongsTo(User, {
  as: "user",
});

export default AuthIntercom;
