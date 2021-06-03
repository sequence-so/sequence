import { InitOptions, DataTypes, Optional, UUID } from "sequelize";
import Sequelize from "sequelize";
import sequelize from "../database";
import User from "./user";
import { v4 as uuidv4 } from "uuid";
import ProductUser from "./product_user";

const config: InitOptions = {
  tableName: "events",
  sequelize,
  paranoid: true,
};

export interface EventAttributes {
  id: string;
  name: string;
  type: string;
  distinctId: string;
  properties: Record<string, any>;
  source: string;
  sourceId: string;
  messageId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCreationAttributes
  extends Optional<
    EventAttributes,
    "id" | "sourceId" | "source" | "properties" | "createdAt" | "updatedAt"
  > {}

class Event extends Sequelize.Model<EventAttributes, EventCreationAttributes> {
  public id!: string;
  public name: string;
  public type: string;
  public distinctId: string;
  public properties: Record<string, any>;
  public source: string;
  public sourceId: string;
  public messageId: string;
  public userId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    properties: DataTypes.JSON,
    source: DataTypes.STRING,
    sourceId: DataTypes.STRING,
    messageId: {
      type: DataTypes.STRING,
      unique: true,
    },
    distinctId: DataTypes.STRING,
    userId: DataTypes.STRING,
  },
  config
);

Event.belongsTo(User, {
  as: "user",
});

export default Event;
