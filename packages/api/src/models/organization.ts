import { InitOptions, Optional, STRING, UUID } from "sequelize";
import { Model } from "sequelize-typescript";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user.model";

const config: InitOptions = {
  tableName: "organizations",
  sequelize,
  paranoid: true,
};

interface OrganizationAttributes {
  id: string;
  name: string;
  photo: string;
  ownerId: string;
}

type OrganizationCreationAttributes = Optional<OrganizationAttributes, "id">;

class Organization extends Model<
  OrganizationAttributes,
  OrganizationCreationAttributes
> {
  public id!: string;
  public name: string;
  public photo: string;
  public ownerId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Organization.init(
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
    photo: {
      type: STRING,
    },
  },
  config
);

Organization.belongsTo(User, {
  as: "owner",
});

export default Organization;
