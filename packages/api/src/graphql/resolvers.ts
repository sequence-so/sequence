import { GraphQLScalarType, Kind } from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import * as AudienceResolvers from "./resolvers/audience.resolver";
import * as CampaignResolvers from "./resolvers/campaign.resolver";
import * as CustomPropertyResolvers from "./resolvers/customProperty.resolver";
import * as EmailResolvers from "./resolvers/email.resolver";
import * as EventResolvers from "./resolvers/event.resolver";
import * as IntercomResolvers from "./resolvers/intercom.resolver";
import * as ProductUserResolvers from "./resolvers/productUser.resolver";
import * as SegmentResolvers from "./resolvers/segment.resolver";
import * as UserResolvers from "./resolvers/user.resolver";

import * as AudienceMutations from "./mutations/audience.mutation";
import * as CampaignMutations from "./mutations/campaign.mutation";
import * as EmailMutations from "./mutations/email.mutation";
import * as IntercomMutations from "./mutations/intercom.mutation";
import * as SegmentMutations from "./mutations/segment.mutation";
import * as WebhookMutations from "./mutations/webhook.mutation";
import { GraphQLContextType } from ".";
import Audience from "src/models/audience";

const resolvers = {
  Query: {
    ...AudienceResolvers,
    ...CampaignResolvers,
    ...CustomPropertyResolvers,
    ...EmailResolvers,
    ...EventResolvers,
    ...IntercomResolvers,
    ...ProductUserResolvers,
    ...SegmentResolvers,
    ...UserResolvers,
  },
  Mutation: {
    ...AudienceMutations,
    ...CampaignMutations,
    ...EmailMutations,
    ...IntercomMutations,
    ...SegmentMutations,
    ...WebhookMutations,
  },
  JSONObject: GraphQLJSONObject,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
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
};

export default resolvers;
