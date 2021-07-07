import Campaign, {
  CampaignCreationAttributes,
  CampaignStateEnum,
} from "src/models/campaign.model";

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

type SeedCreationAttributes = WithOptional<
  CampaignCreationAttributes,
  "isDraft" | "state"
>;

export const build = (
  opts?: SeedCreationAttributes
): CampaignCreationAttributes => {
  return {
    isDraft: true,
    state: CampaignStateEnum.PENDING,
    ...opts,
  };
};

export default async (opts: SeedCreationAttributes) => {
  return await Campaign.create(build(opts));
};
