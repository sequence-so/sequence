import faker from "faker";
import { Optional } from "sequelize/types";
import Email, { EmailCreationAttributes } from "src/models/email.model";

type EmailSeedCreationAttributes = Optional<
  EmailCreationAttributes,
  "from" | "bodyHtml" | "name" | "subject"
>;
export const build = (
  opts?: EmailSeedCreationAttributes
): EmailCreationAttributes => {
  const bodyHtml = opts?.bodyHtml || faker.random.words(80);

  return {
    from: "test@email.com",
    bodyHtml,
    name: "My Amazing Email:" + faker.random.words(3),
    subject: faker.commerce.department() + " " + faker.commerce.product(),
    ...opts,
  };
};

export default async (opts?: EmailSeedCreationAttributes) => {
  return await Email.create(build(opts));
};
