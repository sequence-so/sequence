import { InitOptions, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";

const config: InitOptions = {
  tableName: "user",
  sequelize,
  paranoid: true,
};

class User extends Model {
  public id!: string;
  public firstName: string;
  public lastName: string;
  public email!: string;
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
  },
  config
);

export default User;
