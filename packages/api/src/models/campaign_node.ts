import {
  InitOptions,
  STRING,
  UUID,
  Model,
  JSONB,
  INTEGER,
  DATE,
} from "sequelize";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user";
import Campaign from "./campaign";

const config: InitOptions = {
  tableName: "campaign_nodes",
  sequelize,
  paranoid: true,
};

export interface CampaignNodeAttributes {
  id: string;
  name: string;
  // should be an union of interfaces
  node: any;
  positionX: number;
  positionY: number;
  timeoutAfter: number;
  userId: string;
  campaignId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignNodeCreationAttributes
  extends Omit<CampaignNodeAttributes, "createdAt" | "updatedAt" | "id"> {}

class CampaignNode extends Model<
  CampaignNodeAttributes,
  CampaignNodeCreationAttributes
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

CampaignNode.init(
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
    json: {
      type: JSONB,
    },
    positionX: {
      type: INTEGER,
    },
    positionY: {
      type: INTEGER,
    },
    timeoutAfter: {
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
    userId: {
      type: UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
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

CampaignNode.belongsTo(User, {
  as: "user",
});

CampaignNode.belongsTo(Campaign, {
  as: "campaign",
});

export default CampaignNode;
