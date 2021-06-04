import { GraphQLContextType } from "..";

export const events = async (
  root: any,
  {
    id,
    page,
    limit,
    distinctId,
  }: { id: string; page: number; limit: number; distinctId: string },
  { models, user }: GraphQLContextType
) => {
  page = page || 0;
  limit = limit || 10;
  try {
    const whereQuery: Record<string, any> = {
      userId: user.id,
    };
    if (distinctId) {
      whereQuery.distinctId = distinctId;
    }
    if (id) {
      whereQuery.id = id;
    }
    const events = await models.Event.findAll({
      where: whereQuery,
      limit,
      offset: page * limit,
      order: [["createdAt", "DESC"]],
      include: "productUser",
    });

    const count = await models.Event.count({
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

export const uniqueEventNames = async (
  root: any,
  _: any,
  { models, user }: GraphQLContextType
) => {
  try {
    const events = await models.Event.findAll({
      attributes: ["name"],
      group: "name",
    });

    return events.map((e) => e.name);
  } catch (error) {
    console.error(error);
    return error;
  }
};
