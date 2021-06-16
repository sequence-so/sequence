import { InitOptions, Optional, UUID, Model } from "sequelize";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";

const config: InitOptions = {
  tableName: "audience_product_users",
  sequelize,
  paranoid: false,
};

export interface AudienceProductUserAttributes {
  id: string;
  audienceId: string;
  productUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AudienceProductUserCreationAttributes = Optional<
    AudienceProductUserAttributes,
    "id" | "createdAt" | "updatedAt"
  >

class AudienceProductUser extends Model<
  AudienceProductUserAttributes,
  AudienceProductUserCreationAttributes
> {
  public id!: string;
  public audienceId: string;
  public productUserId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AudienceProductUser.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    audienceId: {
      type: UUID,
      references: {
        model: "audiences",
        key: "id",
      },
      allowNull: false,
    },
    productUserId: {
      type: UUID,
      references: {
        model: "product_users",
        key: "id",
      },
      allowNull: false,
    },
  },
  config
);

export default AudienceProductUser;
