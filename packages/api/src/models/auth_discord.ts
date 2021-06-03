import { BuildOptions, InitOptions, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user";

const config: InitOptions = {
  tableName: "auth_discords",
  sequelize,
  paranoid: true,
};

interface AuthDiscordAttributes {
  id: string;
  discordId: string;
  accessToken: string;
  refreshToken: string;
  webhookId: string;
  channelId: string;
  webhookToken: string;
  photo: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthDiscordCreationAttributes {
  discordId: string;
  accessToken: string;
  refreshToken: string;
  webhookId: string;
  channelId: string;
  webhookToken: string;
  photo: string;
  userId: string;
  expiresAt: Date;
}

class AuthDiscord extends Model<
  AuthDiscordAttributes,
  AuthDiscordCreationAttributes
> {
  public id: string;
  public discordId: string;
  public accessToken: string;
  public refreshToken: string;
  public expiresAt: Date;
  public webhookId: string;
  public channelId: string;
  public webhookToken: string;
  public photo: string;
  public userId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuthDiscord.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    discordId: {
      type: STRING,
      allowNull: false,
    },
    accessToken: {
      type: STRING,
    },
    refreshToken: {
      type: STRING,
    },
    webhookId: {
      type: STRING,
    },
    channelId: {
      type: STRING,
    },
    photo: {
      type: STRING,
    },
    webhookToken: {
      type: STRING,
    },
  },
  config
);

AuthDiscord.belongsTo(User, {
  as: "user",
});

export type DiscordModelStatic = typeof AuthDiscord & {
  new (values?: Record<string, unknown>, options?: BuildOptions): AuthDiscord;
};

export type AuthDiscordInstance = AuthDiscord;

export default AuthDiscord as DiscordModelStatic;
