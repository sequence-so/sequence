import { GraphQLContextType } from "..";
import { WhereOptions } from "sequelize";
import { AudienceAttributes } from "src/models/audience";
import ProductUser from "src/models/product_user";

export const audiences = async (
  _: any,
  { id, page, limit }: { page: number; limit: number; id: string },
  { models, user }: GraphQLContextType
) => {
  page = page || 0;
  limit = limit || 10;

  const where: WhereOptions<AudienceAttributes> = {
    userId: user.id,
  };
  if (id) {
    where.id = id;
  }

  const results = await models.Audience.findAll({
    where,
    limit,
    offset: page * limit,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: ProductUser,
        as: "productUsers",
        required: true,
      },
    ],
  });

  const count = await models.Audience.count({
    where,
  });

  return {
    nodes: results,
    page,
    rows: count,
  };
};
