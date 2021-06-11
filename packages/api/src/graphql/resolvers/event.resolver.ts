import { GraphQLContextType } from "..";

export const events = async (
  root: any,
  {
    id,
    page,
    limit,
    personId,
  }: { id: string; page: number; limit: number; personId: string },
  { models, user }: GraphQLContextType
) => {
  page = page || 0;
  limit = limit || 10;
  try {
    const whereQuery: Record<string, any> = {
      userId: user.id,
      type: "track",
    };
    if (personId) {
      whereQuery.personId = personId;
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
  _1: any,
  _2: any,
  { models, user }: GraphQLContextType
): Promise<string[]> => {
  try {
    const events = await models.Event.findAll({
      attributes: ["name"],
      group: "name",
      where: {
        userId: user.id,
      },
    });

    return events.map((e) => e.name);
  } catch (error) {
    console.error(error);
    return error;
  }
};
