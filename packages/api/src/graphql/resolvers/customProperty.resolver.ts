import { GraphQLContextType } from "..";
import { getTableDefinition } from "../../models/custom_property";

export interface CustomPropertyElement {
  key: string;
  label: string;
  propertyType: string;
}

export const customProperties = async (
  root: any,
  _: any,
  { models, user }: GraphQLContextType
) => {
  try {
    const tableDefinition = getTableDefinition();
    const customPropertyMap: CustomPropertyElement[] = [];
    Object.keys(tableDefinition).forEach((key) => {
      customPropertyMap.push({
        key: key,
        label: key,
        propertyType: tableDefinition[key].type,
      });
    });

    return customPropertyMap;
  } catch (error) {
    console.error(error);
    return error;
  }
};
