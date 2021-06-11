import { InitOptions, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user.model";
import { JSON } from "sequelize";

const config: InitOptions = {
  tableName: "webhook_execution",
  sequelize,
};

class WebhookExecution extends Model {
  public id: string;
  public type: string;
  public payload: string;
  public userId: string;
  public webhookId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WebhookExecution.init(
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
    },
    webhookId: {
      type: UUID,
    },
    payload: {
      type: JSON,
    },
  },
  config
);

WebhookExecution.belongsTo(User, {
  as: "user",
});

export default WebhookExecution;
