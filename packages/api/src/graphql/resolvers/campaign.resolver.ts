import { GraphQLContextType } from "..";

export const campaigns = async (
  root: any,
  {
    id,
    page,
    limit,
  }: { id: string; page: number; limit: number; personId: string },
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
  const events = await models.Campaign.findAll({
    where: whereQuery,
    limit,
    offset: page * limit,
    order: [["createdAt", "DESC"]],
  });

  const count = await models.Campaign.count({
    where: whereQuery,
  });

  return {
    nodes: events,
    page,
    rows: count,
  };
};
