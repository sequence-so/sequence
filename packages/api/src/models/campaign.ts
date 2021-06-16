import { InitOptions, STRING, DATE, BOOLEAN, UUID, Model } from "sequelize";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user";
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
  state: string;
  isDraft: boolean;
  userId: string;
  launchedAt: Date;
  stoppedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignCreationAttributes
  extends Omit<
    CampaignAttributes,
    "createdAt" | "updatedAt" | "id" | "launchedAt" | "stoppedAt"
  > {}

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
    state: {
      type: STRING,
    },
    isDraft: {
      type: BOOLEAN,
    },
    userId: {
      type: UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    launchedAt: {
      allowNull: false,
      type: DATE,
    },
    stoppedAt: {
      allowNull: false,
      type: DATE,
    },
    createdAt: {
      allowNull: false,
      type: DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DATE,
    },
    deletedAt: {
      type: DATE,
    },
  },
  config
);

Campaign.belongsTo(User, {
  as: "user",
});

export default Campaign;
