import {
  InitOptions,
  STRING,
  UUID,
  Model,
  BOOLEAN,
  INTEGER,
  DATE,
} from "sequelize";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user";
import Campaign from "./campaign";
import CampaignNode from "./campaign_node";
import ProductUser from "./product_user";

const config: InitOptions = {
  tableName: "campaign_node_states",
  sequelize,
  paranoid: true,
};

export interface CampaignNodeStateAttributes {
  id: string;
  name: string;
  state: string;
  didTimeout: boolean;
  attempts: number;
  campaignNodeId: string;
  productUserId: string;
  userId: string;
  timeoutAt: Date;
  completedAt: Date;
  campaignId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignNodeStateCreationAttributes
  extends Omit<CampaignNodeStateAttributes, "createdAt" | "updatedAt" | "id"> {}

class CampaignNodeState extends Model<
  CampaignNodeStateAttributes,
  CampaignNodeStateCreationAttributes
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

CampaignNodeState.init(
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
    didTimeout: {
      type: BOOLEAN,
    },
    attempts: {
      allowNull: false,
      defaultValue: 0,
      type: INTEGER,
    },
    campaignNodeId: {
      type: UUID,
      references: {
        model: "campaign_nodes",
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
    userId: {
      type: UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    timeoutAt: {
      type: DATE,
    },
    completedAt: {
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
  },
  config
);

CampaignNodeState.belongsTo(CampaignNode, {
  as: "campaignNode",
});

CampaignNodeState.belongsTo(ProductUser, {
  as: "productUser",
});

CampaignNodeState.belongsTo(User, {
  as: "user",
});

export default CampaignNodeState;
