const resolvers = {
  Query: {
    async getUser(root, { id }, { models }) {
      return models.User.findByPk(id);
    },
    // async getAllStudents(root, args, { models }) {
    //   return models.Student.findAll();
    // },
    // async getHobbies(root, { id }, { models }) {
    //   return models.Hobbies.findByPk(id);
    // },
  },
  Mutation: {
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
};

export default resolvers;
