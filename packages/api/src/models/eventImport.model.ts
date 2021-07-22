import Sequelize, {
  InitOptions,
  Optional,
  STRING,
  BOOLEAN,
  UUID,
  Model,
  DATE,
  INTEGER,
} from "sequelize";
import sequelize from "../database";
import User from "./user.model";

const config: InitOptions = {
  tableName: "event_imports",
  sequelize,
  paranoid: true,
};

export interface EventImportAttributes {
  id: string;
  enabled: boolean;
  type: string;
  cursor: string;
  cursorType: "number" | "string" | "date";
  batchSize: number;
  userId: string;
  executedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type EventImportCreationAttributes = Optional<
  EventImportAttributes,
  | "id"
  | "enabled"
  | "cursor"
  | "cursorType"
  | "batchSize"
  | "createdAt"
  | "updatedAt"
  | "executedAt"
>;

class EventImport extends Model<
  EventImportAttributes,
  EventImportCreationAttributes
> {
  public id!: string;
  public enabled: boolean;
  public type: string;
  public cursor: string;
  public cursorType: "number" | "string" | "date";
  public batchSize: number;
  public userId: string;
  public executedAt: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EventImport.init(
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: UUID,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    },
    enabled: {
      type: BOOLEAN,
      defaultValue: true,
    },
    type: {
      type: STRING,
      allowNull: false,
    },
    cursor: {
      type: STRING,
    },
    cursorType: {
      type: STRING,
    },
    batchSize: {
      type: INTEGER,
      defaultValue: 20,
    },
    userId: {
      type: UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    executedAt: {
      type: DATE,
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

// @ts-ignore
EventImport.associate = () => {
  EventImport.belongsTo(User, {
    as: "user",
  });
};

export default EventImport;
