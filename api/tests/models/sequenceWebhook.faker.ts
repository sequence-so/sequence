import SequenceWebook, {
  SequenceWebhookAttributes,
} from "../../src/models/sequence_webhook";
import { randomBytes } from "crypto";

export default async (opts: SequenceWebhookAttributes) => {
  const token = (await randomBytes(18)).toString("hex");

  return SequenceWebook.create({
    token,
    ...opts,
  });
};
