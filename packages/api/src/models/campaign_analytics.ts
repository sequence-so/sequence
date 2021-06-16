import {
  InitOptions,
  STRING,
  DATE,
  BOOLEAN,
  UUID,
  Model,
  INTEGER,
} from "sequelize";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user.model";

const config: InitOptions = {
  tableName: "campaigns",
  sequelize,
  paranoid: true,
};

export interface CampaignAnalyticsAttributes {
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

export type CampaignAnalyticsCreationAttributes = Omit<
  CampaignAnalyticsAttributes,
  "createdAt" | "updatedAt" | "id" | "launchedAt" | "stoppedAt"
>;

class CampaignAnalytics extends Model<
  CampaignAnalyticsAttributes,
  CampaignAnalyticsCreationAttributes
> {
  public id!: string;
  public name: string;
  public sentAt: Date;
  public userId: string;
  public emailId: string;
  public audienceId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CampaignAnalytics.init(
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
      allowNull: false,
    },
    viewed: {
      type: INTEGER,
      defaultValue: 0,
    },
    clicked: {
      type: INTEGER,
      defaultValue: 0,
    },
    bounced: {
      type: BOOLEAN,
    },
    campaignId: {
      type: UUID,
      references: {
        model: "campaigns",
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
    campaignNodeStateId: {
      type: UUID,
      references: {
        model: "campaign_node_state",
        key: "id",
      },
      allowNull: false,
    },
    userId: {
      type: UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    sentAt: {
      type: DATE,
    },
    viewedAt: {
      type: DATE,
    },
    clickedAt: {
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

CampaignAnalytics.belongsTo(User, {
  as: "user",
});

export default CampaignAnalytics;
