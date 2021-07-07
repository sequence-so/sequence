import faker from "faker";
import SequenceWebhook, {
  SequenceCreationWebhookAttributes,
} from "src/models/sequenceWebhook.model";

export const build = (
  opts?: Partial<SequenceCreationWebhookAttributes>
): SequenceCreationWebhookAttributes => {
  const token = opts?.token || faker.random.alphaNumeric(20);

  return {
    ...opts,
    token,
    userId: opts.userId,
  };
};

export default async (opts?: Partial<SequenceCreationWebhookAttributes>) => {
  return await SequenceWebhook.create(build(opts));
};
