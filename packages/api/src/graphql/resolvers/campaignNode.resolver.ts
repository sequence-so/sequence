import { GraphQLContextType } from "..";

export const campaignNodes = async (
  root: any,
  { id, page, limit }: { id: string; page: number; limit: number },
  { models, user }: GraphQLContextType
) => {
  page = page || 0;
  limit = limit || 10;

  const whereQuery: Record<string, any> = {
    userId: user.id,
  };
  if (id) {
    whereQuery.id = id;
  }
  const events = await models.CampaignNode.findAll({
    where: whereQuery,
    limit,
    offset: page * limit,
    order: [["createdAt", "DESC"]],
  });

  const count = await models.CampaignNode.count({
    where: whereQuery,
  });

  return {
    nodes: events,
    page,
    rows: count,
  };
};
