import { Optional } from "sequelize/types";
import { Op } from "sequelize";
import Email from "src/models/emails";
import { GraphQLContextType } from "..";

type CreateEmailInputArgs = {
  name: string;
  bodyHtml: string;
  bodyText: string;
  subject: string;
  from: string;
  fromName: string;
};

type UpdateEmailInputArgs = Optional<
  CreateEmailInputArgs,
  "name" | "bodyHtml" | "bodyText" | "subject" | "from" | "fromName"
> & {
  id: string;
};

export const createEmail = async (
  root: any,
  { name, bodyHtml, bodyText, subject, from, fromName }: CreateEmailInputArgs,
  { models, user }: GraphQLContextType
) => {
  return await models.Email.create({
    userId: user.id,
    name,
    fromName,
    bodyHtml,
    subject,
    from,
  });
};

export const updateEmail = async (
  root: any,
  args: UpdateEmailInputArgs,
  { models, user }: GraphQLContextType
) => {
  let id = args.id;
  let name = args.name;
  let email: Email;
  let duplicateNameEmail: Email;

  email = await models.Email.findOne({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!email) {
    throw new Error("No email found");
  }

  const updateArgs = { ...args };
  delete updateArgs.id;
  return await email.update(updateArgs);
};

export const deleteEmail = async (
  root: any,
  args: UpdateEmailInputArgs,
  { models, user }: GraphQLContextType
) => {
  let id = args.id;
  let email: Email;

  email = await models.Email.findOne({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!email) {
    throw new Error("No email found");
  }

  await email.destroy();
};
