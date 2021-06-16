import { GraphQLScalarType, Kind } from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { isNull } from "lodash";
import { GraphQLContextType } from ".";
import Audience from "src/models/audience";
import ProductUser from "src/models/product_user";
import { readFilesSync } from "src/utils/readFilesSync";
import path from "path";

const readFromDirectory = (pathname: string) => {
  let cache = {};
  const resolverFiles = readFilesSync(path.join(__dirname, pathname));
  resolverFiles.map((elem) => {
    const module = require(elem.filepath);
    cache = { ...module, ...cache };
  });
  return cache;
};

const getQueries = () => readFromDirectory("resolvers");
const getMutations = () => readFromDirectory("mutations");

const resolvers = {
  Query: getQueries(),
  Mutation: getMutations(),
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
};

export default resolvers;
