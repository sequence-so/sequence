import { GraphQLContextType } from "..";
import { WhereOptions } from "sequelize";
import { AudienceAttributes } from "src/models/audience.model";
import ProductUser from "../../models/productUser.model";

export const audiences = async (
  _: any,
  {
    id,
    page,
    limit,
    localTo,
  }: { page: number; limit: number; localTo: string; id: string },
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
  if (localTo) {
    where.localTo = localTo;
  } else {
    where.localTo = null;
  }

  const results = await models.Audience.findAll({
    where,
    limit,
    offset: page * limit,
    order: [["createdAt", "DESC"]],
    // include: [
    //   {
    //     model: ProductUser,
    //     as: "productUsers",
    //     required: true,
    //   },
    // ],
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
