import { APIEventPayload } from "sequence-lib";
import { BIGINT, FLOAT, UUID, STRING, BOOLEAN, INTEGER } from "sequelize";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import Cache from "../cache";
import CustomProperty from "../models/custom_property";
import sequelize from "../database";
import User from "../models/user";

const getCachePropertiesKey = (userId: string) =>
  `PROPERTY_CACHE_KEYS:${userId}`;
const getCacheKey = (userId: string) => `PROPERTY_CACHE:${userId}`;

const tableOptions = {
  tableName: "custom_properties",
  paranoid: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
};
export const getPropertyTypes = (object: Record<string, any>) => {
  const propertyMap: Record<string, ValidPropertyType> = {};
  const objectKeys = Object.keys(object);
  objectKeys.forEach((key) => {
    let newKey = key;
    let propType: PropertyType = typeof object[key];
    if (propType === "number" && !Number.isInteger(object[key])) {
      propType = "float";
    } else if (object[key] == null) {
      propType = "string";
    } else if (
      propType === "symbol" ||
      propType === "function" ||
      propType === "undefined" ||
      propType === "object"
    ) {
      console.warn(
        `Unsupported property type: ${propType} on ${key} with value ${object[key]}`
      );
      return;
    }
    if (key.startsWith("$")) {
      newKey = `c_${newKey.substring(1, newKey.length)}`;
    }
    propertyMap[newKey] = propType;
  });
  return propertyMap;
};

type PropertyType =
  | "string"
  | "bigint"
  | "symbol"
  | "undefined"
  | "function"
  | "object"
  | "boolean"
  | "number"
  | "null"
  | "float";
type ValidPropertyType =
  | "string"
  | "bigint"
  | "boolean"
  | "number"
  | "null"
  | "float";

const convertType = (type: ValidPropertyType) => {
  if (type === "boolean") {
    return BOOLEAN;
  } else if (type === "number") {
    return INTEGER;
  } else if (type === "float") {
    return FLOAT;
  } else if (type === "bigint") {
    return BIGINT;
  } else if (type === "null" || type === "string") {
    return STRING;
  }
};

export const createTableFromPropertyTypes = (
  object: Record<string, ValidPropertyType>
) => {
  let queryString = `CREATE TABLE IF NOT EXISTS custom_properties (id uuid uuid_generate_v4(), event_id uuid NOT NULL, `;
  const keys = Object.keys(object);
  const initMap: Record<string, any> = {
    id: {
      primaryKey: true,
      unique: true,
      type: UUID,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    userId: {
      type: UUID,
      allowNull: false,
    },
    eventId: UUID,
  };

  keys.forEach((key) => {
    queryString += `${key} `;
    initMap[key] = convertType(object[key]);
  });

  // console.log(initMap);

  CustomProperty.init(initMap, {
    sequelize,
    ...tableOptions,
  });

  CustomProperty.belongsTo(User, {
    as: "userId",
  });

  CustomProperty.sync({
    force: true,
  });

  return CustomProperty;
};

export const createOrUpdateCustomPropertiesTable = async (
  event: APIEventPayload,
  userId: string
) => {
  const eventPropertyKeys = Object.keys(event.properties);
  if (eventPropertyKeys.length === 0) {
    return;
  }
  eventPropertyKeys.sort();
  const cachedPropertiesKeys = Cache.get(
    getCachePropertiesKey(userId)
  ) as string[];

  if (cachedPropertiesKeys) {
    cachedPropertiesKeys.sort();
    if (!_.isEqual(eventPropertyKeys, cachedPropertiesKeys)) {
      // need to do some database manipulations
    }
    // return CustomProperty.init(initMap, {
    //   tableName: "custom_property",
    //   sequelize,
    //   paranoid: true,
    //   createdAt: false,
    //   updatedAt: false,
    //   deletedAt: false,
    // });
  }
  // first time we're getting properties
  // create properties table
  else {
    const propertyTypes = getPropertyTypes(event.properties);
    return createTableFromPropertyTypes(propertyTypes);
  }
};
