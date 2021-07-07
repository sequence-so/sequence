import faker from "faker";
import User, { UserCreationAttributes } from "src/models/user.model";
import { WithOptional } from "./campaign.seed";

export const build = (
  opts?: WithOptional<
    UserCreationAttributes,
    "firstName" | "lastName" | "email" | "password" | "photo"
  >
): UserCreationAttributes => {
  const firstName = opts?.firstName || faker.name.firstName();
  const lastName = opts?.lastName || faker.name.lastName();

  return {
    ...opts,
    firstName,
    lastName,
    password: opts?.password || "test1234",
    email:
      opts?.email ||
      faker.internet.email(
        firstName,
        lastName + faker.random.alpha({ count: 10 })
      ),
    photo: opts?.photo || faker.image.avatar(),
  };
};

export default async (
  opts?: WithOptional<
    UserCreationAttributes,
    "firstName" | "lastName" | "email" | "password" | "photo"
  >
) => {
  return await User.create(build(opts));
};
