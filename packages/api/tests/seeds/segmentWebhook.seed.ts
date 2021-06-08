import faker from "faker";
import SegmentWebhook, {
  SegmentWebhookCreationAttributes,
} from "src/models/segment_webhook";

export const build = (
  opts?: Partial<SegmentWebhookCreationAttributes>
): SegmentWebhookCreationAttributes => {
  let token = opts?.token || faker.random.alphaNumeric(20);

  return {
    ...opts,
    token,
    userId: opts.userId,
  };
};

export default async (opts?: Partial<SegmentWebhookCreationAttributes>) => {
  return await SegmentWebhook.create(build(opts));
};
