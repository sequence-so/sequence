import faker from "faker";
import User, { UserCreationAttributes } from "src/models/user.model";

export const build = (
  opts?: UserCreationAttributes
): UserCreationAttributes => {
  const firstName = opts?.firstName || faker.name.firstName();
  const lastName = opts?.lastName || faker.name.lastName();

  return {
    ...opts,
    firstName,
    lastName,
    password: "test1234",
    email: opts?.email || faker.internet.email(firstName, lastName),
    photo: opts?.photo || faker.image.avatar(),
  };
};

export default async (opts?: UserCreationAttributes) => {
  return await User.create(build(opts));
};
