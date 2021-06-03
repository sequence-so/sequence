import { InitOptions, Optional, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";

const config: InitOptions = {
  tableName: "users",
  sequelize,
  paranoid: true,
};

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "firstName" | "lastName" | "photo"> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string;
  public firstName: string;
  public lastName: string;
  public email!: string;
  public photo: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    firstName: {
      type: STRING,
    },
    lastName: {
      type: STRING,
    },
    email: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    photo: {
      type: STRING,
    },
  },
  config
);

export default User;
