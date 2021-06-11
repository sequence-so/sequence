import Sequelize, { InitOptions, Optional, UUID, Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../database";
import User from "./user.model";

const config: InitOptions = {
  tableName: "emails",
  sequelize,
  paranoid: true,
};

export enum EmailKind {
  Code = "code",
  Rich = "rich",
}

export interface EmailAttributes {
  id: string;
  name: string;
  from: string;
  kind: EmailKind;
  fromName: string | null;
  bodyHtml: string;
  subject: string;
  sentCount: number;
  localTo: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type EmailCreationAttributes = Optional<
  EmailAttributes,
  | "id"
  | "fromName"
  | "kind"
  | "sentCount"
  | "localTo"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
>;

class Email extends Model<EmailAttributes, EmailCreationAttributes> {
  public id!: string;
  public name: string;
  public from: string;
  public fromName: string | null;
  public bodyHtml: string;
  public kind: EmailKind;
  public subject: string;
  public localTo: string;
  public sentCount: number;
  public userId: string;
  public deletedAt: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Email.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    name: {
      type: Sequelize.STRING,
    },
    from: {
      type: Sequelize.STRING,
    },
    fromName: {
      type: Sequelize.STRING,
    },
    bodyHtml: {
      type: Sequelize.TEXT,
    },
    subject: {
      type: Sequelize.STRING,
    },
    kind: {
      type: Sequelize.STRING,
      defaultValue: EmailKind.Rich,
    },
    localTo: Sequelize.STRING,
    sentCount: Sequelize.NUMBER,
    userId: {
      type: Sequelize.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("now()"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("now()"),
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  },
  config
);

Email.belongsTo(User, {
  as: "user",
});

export default Email;
