import { InitOptions, STRING, UUID, DATE, Model } from "sequelize";
import Sequelize from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../database";
import Event from "./event";
import User from "./user";

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
        throw new Error("Both email and externalId cannot be null");
      }
    },
  },
};

export interface ProductUserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  phone: string;
  signedUpAt: Date;
  lastSeenAt: Date;
  browser: string;
  browserVersion: string;
  browserLanguage: string;
  os: string;
  country: string;
  region: string;
  city: string;
  title: string;
  websiteUrl: string;
  companyName: string;
  industry: string;
  intercomId: string;
  externalId: string;
  userId: string;
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
  public firstName: string;
  public lastName: string;
  public email: string;
  public photo: string;
  public phone: string;
  public signedUpAt: Date;
  public lastSeenAt: Date;
  public intercomId: string;
  public externalId: string;
  public browser: string;
  public browserVersion: string;
  public browserLanguage: string;
  public os: string;
  public country: string;
  public region: string;
  public city: string;
  public title: string;
  public websiteUrl: string;
  public companyName: string;
  public industry: string;
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
      validate: {
        isEmail: true,
      },
    },
    photo: {
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

export default ProductUser;

export type ProductUserStatic = typeof ProductUser & {
  new (
    values?: Record<string, unknown>,
    options?: ProductUserAttributes
  ): ProductUser;
};

export type ProductUserInstance = ProductUser;
