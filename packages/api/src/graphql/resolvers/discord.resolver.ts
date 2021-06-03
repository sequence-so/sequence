import fetch from "node-fetch";
import { GraphQLContextType } from "..";

export const getChannelWebhooks = async (
  root: any,
  { code }: { code: string },
  { models, user }: GraphQLContextType
) => {
  const model = await models.AuthDiscord.findOne({
    where: {
      userId: user.id,
    },
  });
  const fetchResult = await fetch(
    `https://discord.com/api/channels/${model.channelId}/webhooks`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${model.accessToken}`,
      },
    }
  );
  const json = await fetchResult.json();
  console.log(json);
  return { result: JSON.stringify(json) };
  // const hook = new Discord.WebhookClient(existingModel.webhookId, existingModel.webhookToken);
  // hook.
  // hook.destroy()
};
