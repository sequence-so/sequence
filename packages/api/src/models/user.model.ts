import { InitOptions, Optional, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import { hash } from "src/utils/password";
import { DATE } from "sequelize";

const config: InitOptions = {
  tableName: "users",
  sequelize,
  paranoid: true,
  defaultScope: {
    attributes: { exclude: ["password"] },
  },
};

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  photo: string;
  onboardedAt: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "firstName" | "lastName" | "photo" | "password" | "onboardedAt"
>;

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string;
  public firstName: string;
  public lastName: string;
  public password: string;
  public email!: string;
  public photo: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  toJSON() {
    // hide password field
    const attributes = Object.assign({}, this.get());
    delete attributes.password;
    return attributes;
  }
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
    password: {
      type: STRING,
    },
    onboardedAt: DATE,
  },
  config
);

User.beforeCreate(async (user) => {
  const hashPassword = await hash(user.password);
  user.password = hashPassword;
});

export default User;
