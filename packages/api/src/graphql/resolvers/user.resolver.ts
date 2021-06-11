import { GraphQLContextType } from "../index";

export const getUser = async (
  root: any,
  _: any,
  { user }: GraphQLContextType
) => {
  return user;
};

export const integrations = async (
  root: any,
  _: any,
  { models, user }: GraphQLContextType
) => {
  const intercom = await models.AuthIntercom.findOne({
    where: {
      userId: user.id,
    },
  });
  const segmentExecution = await models.WebhookExecution.findOne({
    where: {
      userId: user.id,
    },
    order: [["createdAt", "DESC"]],
  });
  const node = await models.SequenceWebhook.findOne({
    where: {
      userId: user.id,
    },
  });
  const integrations: any = {
    intercom: intercom ? true : false,
    segment: segmentExecution ? true : false,
    node: node ? true : false,
  };
  return integrations;
};
