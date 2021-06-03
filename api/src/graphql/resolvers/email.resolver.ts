import { GraphQLContextType } from "..";

export const emails = async (
  root: any,
  { id, page, limit }: { id: string; page: number; limit: number },
  { models, user }: GraphQLContextType
) => {
  page = page || 0;
  limit = limit || 10;
  try {
    const whereQuery: Record<string, any> = {
      userId: user.id,
    };
    if (id) {
      whereQuery.id = id;
    }
    const events = await models.Email.findAll({
      where: whereQuery,
      limit,
      offset: page * limit,
      order: [["createdAt", "DESC"]],
    });

    const count = await models.Email.count({
      where: whereQuery,
    });

    return {
      nodes: events,
      page,
      rows: count,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};
