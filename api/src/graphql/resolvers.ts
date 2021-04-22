import { GraphQLScalarType, Kind } from "graphql";
import fetch from "node-fetch";
import AuthIntercom from "src/models/auth_intercom";
import FormData from "form-data";

const resolvers = {
  Query: {
    async getUser(
      root: any,
      _: any,
      { models, user }: { models: any; user: any }
    ) {
      return user;
    },
    async getIntercom(
      root: any,
      _: any,
      { models, user }: { models: any; user: any }
    ) {
      const intercom = await models.AuthIntercom.findOne({
        where: {
          userId: user.id,
        },
      });
      if (intercom) {
        return {
          id: intercom.id,
          isEnabled: true,
          createdAt: intercom.createdAt,
          updatedAt: intercom.updatedAt,
        };
      }
      return {
        id: null,
        isEnabled: false,
        createdAt: null,
        updatedAt: null,
      };
    },
    async getIntegrations(
      root: any,
      _: any,
      { models, user }: { models: any; user: any }
    ) {
      const intercom = await models.AuthIntercom.findOne({
        where: {
          userId: user.id,
        },
      });
      let integrations: any = {
        intercom: intercom ? true : false,
      };

      return integrations;
    },
  },
  Mutation: {
    async saveIntercomCode(
      root: any,
      { code }: { code: string },
      { models, user }: { models: any; user: any }
    ) {
      const intercom = await models.AuthIntercom.create({
        userId: user.id,
        code,
      });

      const formData = new FormData();
      formData.append("code", code);
      formData.append("client_id", process.env.INTERCOM_CLIENT_ID);
      formData.append("client_secret", process.env.INTERCOM_CLIENT_SECRET);
      const fetchResult = await fetch(
        "https://api.intercom.io/auth/eagle/token",
        {
          method: "POST",
          body: formData,
        }
      );
      const json = (await fetchResult.json()) as { token: string };

      console.log(json);
      intercom.token = json.token;
      intercom.save();

      return {
        id: intercom.id,
        isEnabled: true,
        createdAt: intercom.createdAt,
        updatedAt: intercom.updatedAt,
      };
    },
    // async createStudent(root, { firstName, email }, { models }) {
    //   return models.Student.create({
    //     firstName,
    //     email,
    //   });
    // },
    // async createHobbies(root, { studentId, title }, { models }) {
    //   return models.Hobbies.create({ studentId, title });
    // },
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};

export default resolvers;
