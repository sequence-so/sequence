import { GraphQLScalarType, Kind } from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { isNull } from "lodash";
import { GraphQLContextType } from ".";
import Audience from "src/models/audience.model";
import ProductUser from "../models/productUser.model";
import Campaign from "src/models/campaign.model";
import CampaignNode from "../models/campaignNode.model";
import CampaignNodeEdge from "../models/campaignNodeEdge.model";
import { Op } from "sequelize";

import * as AudienceResolver from "./resolvers/audience.resolver";
import * as BlastResolver from "./resolvers/blast.resolver";
import * as CampaignNodes from "./resolvers/campaignNode.resolver";
import * as CampaignResolver from "./resolvers/campaign.resolver";
import * as EmailResolver from "./resolvers/email.resolver";
import * as EventResolver from "./resolvers/event.resolver";
import * as SegmentResolver from "./resolvers/segment.resolver";
import * as UserResolver from "./resolvers/user.resolver";
import * as ProductUserResolver from "./resolvers/productUser.resolver";

import * as AudienceMutation from "./mutations/audience.mutation";
import * as BlastMutation from "./mutations/blast.mutation";
import * as CampaignMutation from "./mutations/campaign.mutation";
import * as CampaignNodeMutation from "./mutations/campaignNode.mutation";
import * as CampaignNodeEdgeMutation from "./mutations/campaignNodeEdge.mutation";
import * as EmailMutation from "./mutations/email.mutation";
import * as ProductUserMutation from "./mutations/productUser.mutation";
import * as SegmentMutation from "./mutations/segment.mutation";
import * as UserMutation from "./mutations/user.mutation";
import * as WebhookMutation from "./mutations/webhook.mutation";

const Query = {
  ...AudienceResolver,
  ...BlastResolver,
  ...CampaignResolver,
  ...CampaignNodes,
  ...EmailResolver,
  ...EventResolver,
  ...SegmentResolver,
  ...UserResolver,
  ...ProductUserResolver,
};
const Mutation = {
  ...AudienceMutation,
  ...BlastMutation,
  ...CampaignMutation,
  ...CampaignNodeMutation,
  ...CampaignNodeEdgeMutation,
  ...EmailMutation,
  ...ProductUserMutation,
  ...SegmentMutation,
  ...UserMutation,
  ...WebhookMutation,
};

const resolvers = {
  Query,
  Mutation,
  JSONObject: GraphQLJSONObject,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      if (typeof value === "string") {
        return new Date(value).toISOString();
      }
      return value.toISOString(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
  Audience: {
    productUsers: async (root: Audience, _: any, ctx: GraphQLContextType) => {
      const audienceProductUsers = await ctx.models.AudienceProductUser.findAll(
        {
          where: {
            audienceId: root.id,
          },
        }
      );
      const productUserIds = audienceProductUsers.map(
        (elem) => elem.productUserId
      );
      const productUsers = await ctx.models.ProductUser.findAll({
        where: {
          id: productUserIds,
        },
      });
      return productUsers;
    },
  },
  ProductUser: {
    traits: async (root: ProductUser) => {
      if (isNull(root.traits)) {
        return null;
      }
      return root.traits;
    },
  },
  Campaign: {
    campaignNodes: async (root: Campaign, _: any, ctx: GraphQLContextType) => {
      const id = root.id;
      return CampaignNode.findAll({
        where: {
          userId: ctx.user.id,
          campaignId: id,
        },
      });
    },
    campaignNodeEdges: async (
      root: Campaign,
      _: any,
      ctx: GraphQLContextType
    ) => {
      const id = root.id;
      const nodes = await CampaignNode.findAll({
        where: {
          userId: ctx.user.id,
          campaignId: id,
        },
      });
      return CampaignNodeEdge.findAll({
        where: {
          [Op.or]: [
            {
              fromId: nodes.map((n) => n.id),
            },
            {
              toId: nodes.map((n) => n.id),
            },
          ],
        },
      });
    },
  },
  CampaignNode: {
    campaignNodeStates: async (
      root: CampaignNode,
      _: any,
      ctx: GraphQLContextType
    ) => {
      const campaignNodeId = root.id;
      const campaignId = root.campaignId;
      const campaignNodeStates = await ctx.models.CampaignNodeState.findAll({
        where: {
          campaignNodeId,
          campaignId,
        },
      });
      return campaignNodeStates;
    },
  },
};

export default resolvers;
