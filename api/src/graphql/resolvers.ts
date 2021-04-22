import { GraphQLScalarType, Kind } from "graphql";
import AuthIntercom from "src/models/auth_intercom";

const resolvers = {
  Query: {
    async getUser(
      root: any,
      _: any,
      { models, user }: { models: any; user: any }
    ) {
      return user;
    },
    // async getAllStudents(root, args, { models }) {
    //   return models.Student.findAll();
    // },
    // async getHobbies(root, { id }, { models }) {
    //   return models.Hobbies.findByPk(id);
    // },
  },
  Mutation: {
    async saveIntercomCode(
      root: any,
      { code }: { code: string },
      { models }: { models: any }
    ) {
      models.AuthIntercom.create({});
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
