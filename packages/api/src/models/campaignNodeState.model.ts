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
import User from "./user.model";
import Campaign, { CampaignStateEnum } from "./campaign.model";
import CampaignNode from "./campaignNode.model";
import ProductUser from "./productUser.model";

const config: InitOptions = {
  tableName: "campaign_node_states",
  sequelize,
  paranoid: true,
};

export interface CampaignNodeStateAttributes {
  id: string;
  state: CampaignStateEnum;
  didTimeout: boolean;
  attempts: number;
  campaignNodeId: string;
  productUserId: string;
  userId: string;
  runAt: Date;
  timeoutAt: Date;
  completedAt: Date;
  campaignId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignNodeStateCreationAttributes {
  id?: string;
  state: CampaignStateEnum;
  didTimeout?: boolean;
  attempts?: number;
  campaignNodeId: string;
  productUserId: string;
  campaignId: string;
  userId: string;
  runAt: Date;
  timeoutAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class CampaignNodeState extends Model<
  CampaignNodeStateAttributes,
  CampaignNodeStateCreationAttributes
> {
  public id!: string;
  public state: CampaignStateEnum;
  public didTimeout: boolean;
  public attempts: number;
  public campaignNodeId: string;
  public productUserId: string;
  public userId: string;
  public runAt: Date;
  public timeoutAt: Date;
  public completedAt: Date;
  public campaignId: string;
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
    state: {
      type: STRING,
    },
    didTimeout: {
      type: BOOLEAN,
      defaultValue: false,
    },
    attempts: {
      allowNull: false,
      defaultValue: 0,
      type: INTEGER,
    },
    campaignId: {
      type: UUID,
      references: {
        model: "campaigns",
        key: "id",
      },
      allowNull: false,
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
    runAt: {
      type: DATE,
    },
    timeoutAt: {
      type: DATE,
    },
    completedAt: {
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

//@ts-ignore
CampaignNodeState.associate = () => {
  CampaignNodeState.belongsTo(Campaign, {
    as: "campaign",
  });

  CampaignNodeState.belongsTo(CampaignNode, {
    as: "campaignNode",
  });

  CampaignNodeState.belongsTo(User, {
    as: "user",
  });
};

export default CampaignNodeState;
