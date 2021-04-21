const { gql } = require("apollo-server-express");
const typeDefs = gql`
  type Student {
    id: Int!
    firstname: String!
    email: String!
    hobbies: [Hobbies!]!
  }
  type Hobbies {
    id: Int!
    title: String!
    student: Student!
  }
  type Query {
    getStudent(id: Int!): Student
    getAllStudents: [Student!]!
    getHobbies(id: Int!): Hobbies
  }
  type Mutation {
    createStudent(name: String!, email: String!, password: String!): Student!
    createHobbies(studentId: Int!, title: String!): Hobbies!
  }
`;

export default typeDefs;
