import { randomBytes } from "crypto";
import { GraphQLContextType } from "..";

export const createSequenceWebhook = async (
  root: any,
  _: any,
  { models, user }: GraphQLContextType
) => {
  let webhook = await models.SequenceWebhook.findOne({
    where: {
      userId: user.id,
    },
  });

  if (webhook) {
    return webhook;
  }

  const token = (await randomBytes(18)).toString("hex");

  webhook = await models.SequenceWebhook.create({
    token: token,
    userId: user.id,
  });

  return webhook;
};
