import { FindOptions } from "sequelize/types";
import { EmailAttributes } from "src/models/emails";
import { GraphQLContextType } from "..";

export const emails = async (
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
  const events = await models.Email.findAll({
    where: whereQuery,
    limit,
    offset: page * limit,
    order: [["createdAt", "DESC"]],
    paranoid: id ? false : true,
  });
  const count = await models.Email.count({
    where: whereQuery,
    paranoid: id ? false : true,
  });

  return {
    nodes: events,
    page,
    rows: count,
  };
};
