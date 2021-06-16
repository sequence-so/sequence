import { GraphQLContextType } from "..";
import { UserCreationAttributes } from "src/models/user.model";

export const updateUser = async (
  root: any,
  { firstName, lastName, onboardedAt }: UserCreationAttributes,
  { models, user: rootUser }: GraphQLContextType
) => {
  const user = await models.User.findOne({
    where: {
      id: rootUser.id,
    },
  });
  if (firstName) {
    user.set("firstName", firstName);
  }
  if (lastName) {
    user.set("lastName", lastName);
  }
  if (onboardedAt) {
    user.set("onboardedAt", onboardedAt);
  }
  return await user.save();
};
