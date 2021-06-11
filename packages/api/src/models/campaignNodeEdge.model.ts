import { InitOptions, STRING, UUID, Model, DATE } from "sequelize";
import sequelize from "../database";
import { v4 as uuidv4 } from "uuid";
import { EdgeKind } from "common/campaign";
import CampaignNode from "./campaignNode.model";

const config: InitOptions = {
  tableName: "campaign_node_edges",
  sequelize,
  paranoid: true,
};

export interface CampaignNodeEdgeAttributes {
  id: string;
  edgeKind: EdgeKind;
  fromId: string;
  toId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CampaignNodeEdgeCreationAttributes = Omit<
  CampaignNodeEdgeAttributes,
  "createdAt" | "updatedAt"
>;

class CampaignNodeEdge extends Model<
  CampaignNodeEdgeAttributes,
  CampaignNodeEdgeCreationAttributes
> {
  public id!: string;
  public edgeKind: EdgeKind;
  public fromId: string;
  public toId: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CampaignNodeEdge.init(
  {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    edgeKind: {
      type: STRING,
      validate: {
        customValidator(value: string) {
          return typeof EdgeKind[value as EdgeKind] !== "undefined";
        },
      },
    },
    fromId: {
      type: UUID,
      references: {
        model: "campaign_nodes",
        key: "id",
      },
      allowNull: false,
    },
    toId: {
      type: UUID,
      references: {
        model: "campaign_nodes",
        key: "id",
      },
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DATE,
    },
    deletedAt: {
      type: DATE,
    },
  },
  config
);

CampaignNodeEdge.belongsTo(CampaignNode, {
  foreignKey: "fromId",
});

CampaignNodeEdge.belongsTo(CampaignNode, {
  foreignKey: "toId",
});

export default CampaignNodeEdge;
