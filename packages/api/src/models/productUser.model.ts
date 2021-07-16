import { InitOptions, STRING, UUID, DATE, Model, JSONB } from "sequelize";
import Sequelize from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../database";
import Event from "./event.model";
import User from "./user.model";
import { EventContext } from "sequence-node";
import { productUserSaved } from "src/events/productUserSaved.event";
import CampaignNodeState from "./campaignNodeState.model";

const config: InitOptions = {
  tableName: "product_users",
  sequelize,
  paranoid: true,
  validate: {
    emailOrExternalId() {
      if (
        !(this as ProductUserInstance).email &&
        !(this as ProductUserInstance).externalId
      ) {
        return false;
      }
      return true;
    },
  },
};

export const VALID_KEYS = {
  browser: 1,
  browserLanguage: 1,
  browserVersion: 1,
  city: 1,
  companyName: 1,
  country: 1,
  createdAt: 1,
  email: 1,
  firstName: 1,
  industry: 1,
  intercomId: 1,
  lastName: 1,
  lastSeenAt: 1,
  os: 1,
  phone: 1,
  photo: 1,
  region: 1,
  signedUpAt: 1,
  title: 1,
  userId: 1,
  websiteUrl: 1,
};

export interface ProductUserAttributes {
  id: string;
  browser: string;
  browserLanguage: string;
  browserVersion: string;
  city: string;
  companyName: string;
  context: EventContext;
  country: string;
  email: string;
  externalId: string;
  firstName: string;
  industry: string;
  intercomId: string;
  lastName: string;
  lastSeenAt: Date;
  os: string;
  phone: string;
  photo: string;
  region: string;
  signedUpAt: Date | null;
  title: string;
  traits: Record<string, any>;
  websiteUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductUserCreationAttributes
  extends Partial<ProductUserAttributes> {
  userId: string;
}

class ProductUser extends Model<
  ProductUserAttributes,
  ProductUserCreationAttributes
> {
  public id!: string;
  public browser: string;
  public browserLanguage: string;
  public browserVersion: string;
  public city: string;
  public context: EventContext;
  public companyName: string;
  public country: string;
  public email: string;
  public externalId: string;
  public firstName: string;
  public industry: string;
  public intercomId: string;
  public lastName: string;
  public lastSeenAt: Date;
  public os: string;
  public phone: string;
  public photo: string;
  public traits: Record<string, any>;
  public region: string;
  public signedUpAt: Date | null;
  public title: string;
  public websiteUrl: string;
  public userId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductUser.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    intercomId: {
      type: STRING,
    },
    externalId: {
      type: STRING,
    },
    firstName: {
      type: STRING,
    },
    lastName: {
      type: STRING,
    },
    email: {
      type: STRING,
    },
    photo: {
      type: STRING,
    },
    phone: {
      type: STRING,
    },
    signedUpAt: {
      type: DATE,
    },
    lastSeenAt: {
      type: DATE,
    },
    browser: {
      type: STRING,
    },
    browserVersion: {
      type: STRING,
    },
    browserLanguage: {
      type: STRING,
    },
    os: {
      type: STRING,
    },
    country: {
      type: STRING,
    },
    region: {
      type: STRING,
    },
    city: {
      type: STRING,
    },
    title: {
      type: STRING,
    },
    websiteUrl: {
      type: STRING,
    },
    companyName: {
      type: STRING,
    },
    industry: {
      type: STRING,
    },
    traits: {
      type: JSONB,
    },
    context: {
      type: JSONB,
      get() {
        return JSON.parse(this.getDataValue("context"));
      },
      set(value) {
        this.setDataValue("context", JSON.stringify(value));
      },
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
  },
  config
);

ProductUser.addHook("afterSave", async (model) => {
  if (model.isSoftDeleted()) {
    return;
  }
  // check if we should be added to a campaign
  await productUserSaved(model as ProductUser);
});

//@ts-ignore
ProductUser.associate = () => {
  ProductUser.belongsTo(User, {
    as: "user",
  });

  ProductUser.hasMany(Event, {
    as: "events",
    foreignKey: "personId",
    sourceKey: "externalId",
  });

  Event.belongsTo(ProductUser, {
    as: "productUser",
    foreignKey: "personId",
    targetKey: "externalId",
  });

  CampaignNodeState.belongsTo(ProductUser, {
    as: "productUser",
  });
};

export default ProductUser;

export type ProductUserInstance = ProductUser;
