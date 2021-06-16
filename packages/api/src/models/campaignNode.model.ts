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
import User from "./user.model";
import Campaign from "./campaign.model";
import {
  AudienceNodeJson,
  CampaignNodeKind,
  EmailCampaignNodeJson,
  FilterCampaignNodeJson,
  TriggerCampaignNodeJson,
  WaitCampaignNodeJson,
} from "common/campaign";

const config: InitOptions = {
  tableName: "campaign_nodes",
  sequelize,
  paranoid: true,
};

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type CampaignNodeJson =
  | FilterCampaignNodeJson
  | EmailCampaignNodeJson
  | WaitCampaignNodeJson
  | TriggerCampaignNodeJson
  | AudienceNodeJson;

export interface CampaignNodeAttributes {
  id: string;
  name: string;
  kind: CampaignNodeKind;
  json: CampaignNodeJson;
  positionX: number;
  positionY: number;
  timeoutAfter: number;
  userId: string;
  campaignId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CampaignNodeCreationAttributes = WithOptional<
  CampaignNodeAttributes,
  | "id"
  | "name"
  | "timeoutAfter"
  | "createdAt"
  | "updatedAt"
  | "positionX"
  | "positionY"
>;

class CampaignNode extends Model<
  CampaignNodeAttributes,
  CampaignNodeCreationAttributes
> {
  public id!: string;
  public name: string;
  public kind: CampaignNodeKind;
  public json: CampaignNodeJson;
  public positionX: number;
  public positionY: number;
  public timeoutAfter: number;
  public userId: string;
  public campaignId: string;
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
    kind: {
      type: STRING,
      validate: {
        customValidator(value: string) {
          return (
            typeof CampaignNodeKind[value as CampaignNodeKind] !== "undefined"
          );
        },
      },
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
