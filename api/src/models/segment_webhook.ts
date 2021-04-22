import { InitOptions, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user";
import { NUMBER } from "sequelize";
import { DATE } from "sequelize";
import { INTEGER } from "sequelize";

const config: InitOptions = {
  tableName: "segment_webhook",
  sequelize,
  paranoid: true,
};

class SegmentWebhook extends Model {
  public id: string;
  public token: string;
  public userId: string;
  public executions: number;
  public lastExecutionAt: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SegmentWebhook.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    token: {
      type: STRING,
    },
    executions: {
      type: INTEGER,
      defaultValue: 0,
    },
    lastExecutionAt: {
      type: DATE,
    },
  },
  config
);

SegmentWebhook.belongsTo(User, {
  as: "user",
});

export default SegmentWebhook;
