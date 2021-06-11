import { InitOptions, STRING, DATE, BOOLEAN, UUID, Model } from "sequelize";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user.model";

const config: InitOptions = {
  tableName: "campaigns",
  sequelize,
  paranoid: true,
};

export interface CampaignAttributes {
  id: string;
  name: string;
  state: CampaignStateEnum;
  isDraft: boolean;
  userId: string;
  launchedAt: Date;
  stoppedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum CampaignStateEnum {
  // Not yet executed
  PENDING = "PENDING",
  // Currently executing
  RUNNING = "RUNNING",
  // Done with campaign
  COMPLETED = "COMPLETED",
  // Stopped by the user
  STOPPED = "STOPPED",
  // An unrecoverable error has occurred
  ERROR = "ERROR",
}

export interface CampaignCreationAttributes {
  id?: string;
  name?: string;
  state: CampaignStateEnum;
  isDraft?: boolean;
  userId: string;
  launchedAt?: Date;
  stoppedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class Campaign extends Model<CampaignAttributes, CampaignCreationAttributes> {
  public id!: string;
  public name: string;
  public state: CampaignStateEnum;
  public isDraft: boolean;
  public sentAt: Date;
  public launchedAt: Date;
  public stoppedAt: Date;
  public userId: string;
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
      defaultValue: true,
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
      type: DATE,
    },
    stoppedAt: {
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
