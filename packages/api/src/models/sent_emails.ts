import Sequelize, { InitOptions, Optional, UUID, Model } from "sequelize";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user.model";

const config: InitOptions = {
  tableName: "sent_emails",
  sequelize,
  paranoid: true,
};

export interface SentEmailAttributes {
  id: string;
  error: string;
  deliveryStatus: string;
  emailId: string;
  productUserId: string;
  deliveredAt: Date;
  erroredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SentEmailCreationAttributes = Optional<
  SentEmailAttributes,
  | "id"
  | "error"
  | "deliveryStatus"
  | "erroredAt"
  | "deliveredAt"
  | "createdAt"
  | "updatedAt"
>;

class SentEmail extends Model<
  SentEmailAttributes,
  SentEmailCreationAttributes
> {
  public id!: string;
  public error: string;
  public deliveryStatus: string;
  public emailId: string;
  public productUserId: string;
  public deliveredAt: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SentEmail.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    emailId: {
      type: UUID,
      references: {
        model: "emails",
        key: "id",
      },
      allowNull: false,
    },
    productUserId: {
      type: UUID,
      references: {
        model: "product_users",
        key: "id",
      },
      allowNull: false,
    },
    deliveredAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    erroredAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    error: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    deliveryStatus: {
      type: Sequelize.STRING,
      allowNull: true,
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
  },
  config
);

SentEmail.belongsTo(User, {
  as: "user",
});

export default SentEmail;
