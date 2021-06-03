export const getSegmentWebhook = async (
  root: any,
  _: any,
  { models, user }: { models: any; user: any }
) => {
  const webhook = await models.SegmentWebhook.findOne({
    where: {
      userId: user.id,
    },
  });
  if (!webhook) {
    return null;
  }

  const execution = await models.WebhookExecution.findOne({
    where: {
      userId: user.id,
    },
    order: [["createdAt", "DESC"]],
  });

  return {
    id: webhook.id,
    token: webhook.token,
    receivedDataAt: execution ? execution.createdAt : null,
    createdAt: webhook.createdAt,
    updatedAt: webhook.updatedAt,
  };
};
