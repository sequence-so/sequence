import CampaignNode, {
  CampaignNodeCreationAttributes,
} from "src/models/campaignNode.model";

export const build = (
  opts?: CampaignNodeCreationAttributes
): CampaignNodeCreationAttributes => {
  return {
    ...opts,
  };
};

export default async (opts: CampaignNodeCreationAttributes) => {
  return await CampaignNode.create(build(opts));
};
