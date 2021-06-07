//@ts-ignore
require("../../src/app");

import UserSeed from "./user.seed";
import { track, alias } from "./event.seed";
import ProductUserSeed from "./productUser.seed";
import faker from "faker";
import { v4 as uuidv4 } from "uuid";
import { QueryInterface } from "sequelize";

export const up = async () => {
  const user = await UserSeed({
    email: "test@email.com",
    firstName: "Test",
    lastName: "User",
  });

  const personIds: string[] = new Array(20).fill(null).map(() => uuidv4());

  await Promise.all(
    personIds.map((id) =>
      ProductUserSeed({
        externalId: id,
        userId: user.id,
      })
    )
  );
  await Promise.all(
    new Array(1000).fill(null).map(async () => {
      track({
        personId: faker.random.arrayElement(personIds),
        messageId: uuidv4(),
        userId: user.id,
      });
    })
  );

  await Promise.all(
    new Array(100).fill(null).map(async () => {
      alias({
        personId: faker.random.arrayElement(personIds),
        messageId: uuidv4(),
        userId: user.id,
      });
    })
  );

  return {
    user,
  };
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete("users", null, {});
  await queryInterface.bulkDelete("product_users", null, {});
  await queryInterface.bulkDelete("events", null, {});
};

if (require.main === module) {
  up();
}
