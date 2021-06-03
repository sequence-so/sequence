import faker from "faker";
import User, { UserCreationAttributes } from "src/models/user";

export const build = (
  opts?: UserCreationAttributes
): UserCreationAttributes => {
  let firstName = opts?.firstName || faker.name.firstName();
  let lastName = opts?.lastName || faker.name.lastName();

  return {
    ...opts,
    firstName,
    lastName,
    email: opts?.email || faker.internet.email(firstName, lastName),
    photo: opts?.photo || faker.image.avatar(),
  };
};

export default async (opts?: UserCreationAttributes) => {
  return await User.create(build(opts));
};
