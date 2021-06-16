import { InitOptions, STRING, UUID, Model } from "sequelize";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import User from "./user.model";
import { DATE } from "sequelize";
import Email from "./email.model";
import Audience from "./audience.model";

const config: InitOptions = {
  tableName: "blasts",
  sequelize,
  paranoid: true,
};

export interface BlastAttributes {
  id: string;
  name: string;
  sentAt: Date;
  userId: string;
  emailId: string;
  audienceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BlastCreationAttributes = Omit<
  BlastAttributes,
  "createdAt" | "updatedAt" | "id"
>;

class Blast extends Model<BlastAttributes, BlastCreationAttributes> {
  public id!: string;
  public name: string;
  public sentAt: Date;
  public userId: string;
  public emailId: string;
  public audienceId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Blast.init(
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
    sentAt: {
      type: DATE,
    },
    emailId: {
      type: UUID,
      references: {
        model: "emails",
        key: "id",
      },
    },
    audienceId: {
      type: UUID,
      references: {
        model: "audiences",
        key: "id",
      },
    },
    userId: {
      type: UUID,
      references: {
        model: "users",
        key: "id",
      },
    },
    createdAt: {
      allowNull: false,
      type: DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DATE,
    },
  },
  config
);

Blast.belongsTo(User, {
  as: "user",
});

Blast.belongsTo(Email, {
  as: "email",
});

Blast.belongsTo(Audience, {
  as: "audience",
});

export default Blast;
