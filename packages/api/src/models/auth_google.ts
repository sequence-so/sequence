import { InitOptions, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user.model";

const config: InitOptions = {
  tableName: "auth_googles",
  sequelize,
  paranoid: true,
};

class AuthGoogle extends Model {
  public id: string;
  public accessToken: string;
  public refreshToken: string;
  public email: string;
  public photo: string;
  public userId: string;
  public googleId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuthGoogle.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    googleId: {
      type: STRING,
      allowNull: false,
    },
    accessToken: {
      type: STRING,
    },
    refreshToken: {
      type: STRING,
    },
    email: {
      type: STRING,
    },
    photo: {
      type: STRING,
    },
  },
  config
);

AuthGoogle.belongsTo(User, {
  as: "user",
});

export default AuthGoogle;
