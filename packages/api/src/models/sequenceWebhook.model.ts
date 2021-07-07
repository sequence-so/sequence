import { BuildOptions, InitOptions, Optional, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user.model";
import { DATE } from "sequelize";
import { INTEGER } from "sequelize";

const config: InitOptions = {
  tableName: "sequence_webhook",
  sequelize,
  paranoid: true,
};

export interface SequenceWebhookAttributes {
  id: string;
  token: string;
  userId: string;
  executions: number;
  lastExecutionAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SequenceCreationWebhookAttributes {
  token: string;
  userId: string;
}

class SequenceWebhook extends Model<
  SequenceWebhookAttributes,
  SequenceCreationWebhookAttributes
> {
  public id: string;
  public token: string;
  public userId: string;
  public executions: number;
  public lastExecutionAt: Date;
  public user?: User;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SequenceWebhook.init(
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

SequenceWebhook.belongsTo(User, {
  as: "user",
});

export type SequenceWebhookModelStatic = typeof SequenceWebhook & {
  new (values?: Record<string, any>, options?: BuildOptions): SequenceWebhook;
};

export type SequenceWebhookInstance = SequenceWebhook;

export default SequenceWebhook;
