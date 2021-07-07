// deleteProductUser

import { FindOptions } from "sequelize/types";
import SequenceError, { MODEL_NOT_FOUND } from "src/error/sequenceError";
import ProductUser, {
  ProductUserAttributes,
} from "src/models/productUser.model";
import { GraphQLContextType } from "..";

type DeleteProductUserInputArgs = {
  id?: string;
  customerId?: string;
};

export const deleteProductUser = async (
  _: any,
  args: DeleteProductUserInputArgs,
  { models, user }: GraphQLContextType
) => {
  const id = args.id;
  const customerId = args.customerId;

  if (!id && !customerId) {
    throw new Error("Must provide id or customerId as an argument");
  }
  let productUser: ProductUser;

  const query: FindOptions<ProductUserAttributes> = {
    where: {
      userId: user.id,
    },
  };

  if (id) {
    //@ts-ignore
    query.where.id = id;
  } else {
    //@ts-ignore
    query.where.externalId = customerId;
  }

  productUser = await models.ProductUser.findOne(query);

  if (!productUser) {
    return { success: false, message: "No productUser found" };
  }

  await productUser.destroy();

  return { success: true };
};
