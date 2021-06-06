import { GraphQLContextType } from "../index";

export const getUser = async (
  root: any,
  _: any,
  { user }: GraphQLContextType
) => {
  return user;
};
