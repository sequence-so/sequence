import {
  InitOptions,
  Optional,
  STRING,
  UUID,
  Model,
  JSON,
  DATE,
  INTEGER,
} from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../database";
import User from "./user";
import ProductUser from "./product_user";
import AudienceProductUser from "./audience_product_user";

const config: InitOptions = {
  tableName: "audiences",
  sequelize,
  paranoid: true,
};

export interface AudienceAttributes {
  id: string;
  name: string;
  node: string;
  count: number;
  userId: string;
  executedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudienceCreationAttributes
  extends Optional<
    AudienceAttributes,
    "id" | "node" | "count" | "createdAt" | "updatedAt" | "executedAt"
  > {}

class Audience extends Model<AudienceAttributes, AudienceCreationAttributes> {
  public id!: string;
  public name: string;
  public node: string;
  public count: number;
  public userId: string;
  public executedAt: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Audience.init(
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
    node: {
      type: JSON,
    },
    executedAt: {
      type: DATE,
    },
    count: {
      type: INTEGER,
    },
    userId: {
      type: UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
  },
  config
);

Audience.belongsTo(User, {
  as: "user",
});

Audience.belongsToMany(ProductUser, {
  through: AudienceProductUser,
  foreignKey: "audienceId",
  as: "productUsers",
});

ProductUser.belongsToMany(Audience, {
  through: AudienceProductUser,
  foreignKey: "productUserId",
  as: "audiences",
});

AudienceProductUser.belongsTo(ProductUser, {
  as: "productUser",
});

export default Audience;
