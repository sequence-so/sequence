import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes);

export const createSegmentWebhook = async (
  root: any,
  _: any,
  { models, user }: { models: any; user: any }
) => {
  let webhook = await models.SegmentWebhook.findOne({
    userId: user.id,
  });

  if (webhook) {
    return webhook;
  }

  const token = (await randomBytes(18)).toString("hex");

  webhook = await models.SegmentWebhook.create({
    token: token,
    userId: user.id,
    receivedDataAt: null,
  });

  return webhook;
};
