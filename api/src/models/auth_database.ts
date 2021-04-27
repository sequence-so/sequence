import { InitOptions, STRING, UUID, INTEGER } from "sequelize";
import { Model } from "sequelize-typescript";
import Cryptr from "cryptr";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user";
import { BOOLEAN } from "sequelize";
import { TEXT } from "sequelize";
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

const config: InitOptions = {
  tableName: "auth_databases",
  sequelize,
  paranoid: true,
};

class AuthDatabase extends Model {
  public id: string;
  public type: string;
  public username: string;
  public hostname: string;
  public schema: string;
  public database: string;
  public password: string;
  public port: number;
  public ssl: boolean;
  public user_id: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuthDatabase.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    type: {
      type: STRING,
    },
    username: {
      type: TEXT,
    },
    hostname: {
      type: TEXT,
    },
    schema: {
      type: TEXT,
    },
    database: {
      type: TEXT,
    },
    password: {
      type: TEXT,
    },
    port: {
      type: INTEGER,
    },
    ssl: {
      type: BOOLEAN,
    },
  },
  config
);

AuthDatabase.belongsTo(User, {
  as: "user",
});

AuthDatabase.beforeCreate((instance: AuthDatabase) => {
  const { username, password, hostname, database, schema } = instance;

  const usernameEncrypted = cryptr.encrypt(username);
  const passwordEncrypted = cryptr.encrypt(password);
  const hostnameEncrypted = cryptr.encrypt(hostname);
  const databaseEncrypted = cryptr.encrypt(database);
  const schemaEncrypted = cryptr.encrypt(schema);

  instance.username = usernameEncrypted;
  instance.password = passwordEncrypted;
  instance.hostname = hostnameEncrypted;
  instance.database = databaseEncrypted;
  instance.schema = schemaEncrypted;
});

export default AuthDatabase;
