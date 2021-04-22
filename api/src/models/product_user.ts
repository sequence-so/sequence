import { InitOptions, Optional, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import { DATE } from "sequelize";

const config: InitOptions = {
  tableName: "product_user",
  sequelize,
  paranoid: true,
};

interface ProductUserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  phone: string;
  signedUpAt: Date;
  lastSeenAt: Date;
  intercomId: string;
  externalId: string;
}

interface ProductUserCreationAttributes
  extends Optional<ProductUserAttributes, "id"> {}

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
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public intercomId: string;
  public externalId: string;
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
    signedUpAt: {
      type: DATE,
    },
    lastSeenAt: {
      type: DATE,
    },
  },
  config
);

export default ProductUser;
