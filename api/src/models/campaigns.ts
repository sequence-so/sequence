import { InitOptions, STRING, UUID, Model } from "sequelize";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user";
import { DATE } from "sequelize";
import Email from "./emails";
import Audience from "./audience";

const config: InitOptions = {
  tableName: "campaigns",
  sequelize,
  paranoid: true,
};

export interface CampaignAttributes {
  id: string;
  name: string;
  sentAt: Date;
  userId: string;
  emailId: string;
  audienceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignCreationAttributes
  extends Omit<CampaignAttributes, "createdAt" | "updatedAt" | "id"> {}

class Campaign extends Model<CampaignAttributes, CampaignCreationAttributes> {
  public id!: string;
  public name: string;
  public sentAt: Date;
  public userId: string;
  public emailId: string;
  public audienceId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Campaign.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    name: {
      type: STRING,
    },
    sentAt: {
      type: DATE,
    },
    emailId: {
      type: UUID,
      references: {
        model: "emails",
        key: "id",
      },
    },
    audienceId: {
      type: UUID,
      references: {
        model: "audiences",
        key: "id",
      },
    },
    userId: {
      type: UUID,
      references: {
        model: "users",
        key: "id",
      },
    },
    createdAt: {
      allowNull: false,
      type: DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DATE,
    },
  },
  config
);

Campaign.belongsTo(User, {
  as: "user",
});

Campaign.belongsTo(Email, {
  as: "email",
});

Campaign.belongsTo(Audience, {
  as: "audience",
});

export default Campaign;
