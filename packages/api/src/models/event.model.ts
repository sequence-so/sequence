import { InitOptions, DataTypes, Optional, UUID } from "sequelize";
import Sequelize from "sequelize";
import sequelize from "../database";
import User from "./user.model";
import { v4 as uuidv4 } from "uuid";
import { EventContext } from "sequence-node";
import ProductUser from "./productUser.model";
import { productUserSaved } from "src/events/productUserSaved.event";

const config: InitOptions = {
  tableName: "events",
  sequelize,
  paranoid: true,
};

export interface EventAttributes {
  id: string;
  name: string;
  type: string;
  personId: string;
  properties: Record<string, any>;
  source: string;
  sourceId: string;
  messageId: string;
  sentAt: Date;
  timestamp: Date;
  receivedAt: Date;
  context: EventContext;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EventCreationAttributes = Optional<
  EventAttributes,
  "id" | "sourceId" | "source" | "properties" | "createdAt" | "updatedAt"
>;

class Event extends Sequelize.Model<EventAttributes, EventCreationAttributes> {
  public id!: string;
  public name: string;
  public type: string;
  /**
   * External ID of the User. Links to ProductUser.externalId
   */
  public personId: string;
  public properties: Record<string, any>;
  public source: string;
  public sourceId: string;
  public messageId: string;
  public timestamp: Date;
  public receivedAt: Date;
  public sentAt: Date;
  public context: EventContext;
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
    properties: {
      type: DataTypes.JSONB,
    },
    context: {
      type: DataTypes.JSONB,
    },
    source: DataTypes.STRING,
    sourceId: DataTypes.STRING,
    receivedAt: DataTypes.DATE,
    sentAt: DataTypes.DATE,
    timestamp: DataTypes.DATE,
    messageId: {
      type: DataTypes.STRING,
      // TODO: this index should be unique on userId & messageId not just userId.
      // and ideally we link to an organizationId instead
      unique: true,
    },
    personId: DataTypes.STRING,
    userId: DataTypes.STRING,
  },
  config
);

// After event has been saved, see if we can add the ProductUser associated
// with this Event to a campaign
Event.addHook("afterSave", async (model: Event) => {
  if (model.isSoftDeleted()) {
    return;
  }
  const productUser = await ProductUser.findOne({
    where: {
      externalId: model.personId,
    },
  });
  if (productUser) {
    productUserSaved(productUser);
  }
});

//@ts-ignore
Event.associate = () => {
  Event.belongsTo(User, {
    as: "user",
  });
};

export default Event;
