import { GraphQLContextType } from "../index";

export const getIntercom = async (
  root: any,
  _: any,
  { models, user }: GraphQLContextType
) => {
  const intercom = await models.AuthIntercom.findOne({
    where: {
      userId: user.id,
    },
  });
  if (intercom) {
    return {
      id: intercom.id,
      isEnabled: true,
      createdAt: intercom.createdAt,
      updatedAt: intercom.updatedAt,
    };
  }
  return {
    id: null,
    isEnabled: false,
    createdAt: null,
    updatedAt: null,
  };
};
