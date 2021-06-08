import { deserialize, SerializedConditionNode } from "common/filters";
import { WhereOptions } from "sequelize/types";
import { AudienceBuilder } from "src/audience";
import { GraphQLContextType } from "..";
import { ProductUserAttributes } from "src/models/product_user";

export const productUsers = async (
  root: any,
  { id, page, limit }: { id: string; page: number; limit: number },
  { models, user }: GraphQLContextType
) => {
  page = page || 0;
  limit = limit || 10;
  const where: WhereOptions<ProductUserAttributes> = {
    userId: user.id,
  };
  if (id) {
    where.id = id;
  }
  try {
    const productUsers = await models.ProductUser.findAll({
      where,
      limit,
      offset: page * limit,
      order: [["createdAt", "DESC"]],
    });

    const count = await models.ProductUser.count({
      where,
    });

    return {
      nodes: productUsers,
      page,
      rows: count,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};
