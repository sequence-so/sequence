import { deserialize, SerializedConditionNode } from "common/filters";
import { AudienceBuilder } from "src/audience";
import { GraphQLContextType } from "..";

export const productUsers = async (
  root: any,
  { page, limit }: { page: number; limit: number },
  { models, user }: GraphQLContextType
) => {
  page = page || 0;
  limit = limit || 10;
  try {
    const productUsers = await models.ProductUser.findAll({
      where: {
        userId: user.id,
      },
      limit,
      offset: page * limit,
      order: [["createdAt", "DESC"]],
    });

    const count = await models.ProductUser.count({
      where: {
        userId: user.id,
      },
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
