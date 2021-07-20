import { EventPayload } from "sequence-node";
import ProductUser, {
  ProductUserCreationAttributes,
  VALID_KEYS,
} from "../models/productUser.model";
import merge from "lodash/merge";
import { snakeCase as toSnakeCase } from "snake-case";
import { camelCase } from "camel-case";

export const getCustomTraits = (traits: Record<string, any>) => {
  const customTraits: Record<string, any> = {};

  Object.keys(traits).forEach((key: string) => {
    if (typeof (VALID_KEYS as any)[camelCase(key)] === "undefined") {
      customTraits[key] = traits[key];
    }
  });

  return customTraits;
};
/**
 * Merges old and new traits. If new traits provides a null/undefined value,
 * we delete the key from the traits object, as a way to unset a value.
 *
 * @param a Original traits
 * @param b New traits
 * @returns Traits object
 */
export const customMerge = (a: Record<string, any>, b: Record<string, any>) => {
  const newTraits = merge(a, b);

  // delete keys that have a undefined/null value
  Object.keys(b).forEach((key) => {
    if (b[key] === undefined || b[key] === null) {
      delete newTraits[key];
    }
  });
  return newTraits;
};

export const getAttribute = (obj: Record<string, any>, key: string) => {
  const camelCase = key;
  const snakeCase = toSnakeCase(key);

  if (typeof obj[camelCase] !== "undefined") {
    return obj[camelCase];
  }
  if (typeof obj[snakeCase] !== "undefined") {
    return obj[snakeCase];
  }
  return undefined;
};

export const parseNameAttribute = (
  obj: Record<string, any>
): { firstName: string; lastName: string } => {
  if (obj.name) {
    const name = obj.name as string;
    const split = name.split(" ");
    if (split.length > 1) {
      const index = name.indexOf(" ");
      const rest = name.substr(index + 1, name.length - index).trim();
      const lastName = rest;
      return { firstName: split[0], lastName };
    }
    return { firstName: name, lastName: "" };
  }
};
/**
 * Saves the `identify` event type to the database.
 *
 * If a user exists for specified `userId` (which is stored as `ProductUser.externalId`),
 * then we perform an update.
 *
 * Otherwise, create the ProductUser with the given attributes.
 *
 * @returns ProductUser The created or updated ProductUser
 */
export const identify = async (
  event: EventPayload,
  meta: {
    userId: string;
  }
): Promise<ProductUser> => {
  if (event.type !== "identify") {
    throw new Error(
      `Wrong handler used for event type '${event.type}', expected 'identify'`
    );
  }

  let productUser = await ProductUser.findOne({
    where: {
      externalId: event.userId,
      userId: meta.userId,
    },
  });

  if (!productUser) {
    const traits: Record<string, any> = event.traits || {};
    productUser = await ProductUser.create({
      externalId: event.userId,
      email: traits.email || "",
      firstName: traits.firstName || "",
      lastName: traits.lastName || "",
      photo: traits.photo || "",
      phone: traits.phone || "",
      signedUpAt: traits.createdAt || null,
      intercomId: traits.intercomId || null,
      city: traits.city || "",
      companyName: traits.companyName || "",
      country: traits.country || "",
      industry: traits.industry || "",
      title: traits.title || "",
      websiteUrl: traits.websiteUrl || "",
      region: traits.region || "",
      userId: meta.userId,
      lastSeenAt: new Date(),
      traits: {},
      context: event.context,
      // These should really be detected from Context
      browser: traits.browser || "",
      browserVersion: traits.browserVersion || "",
      browserLanguage: traits.browserLanguage || "",
    });
  }

  const upsertAttrs: Omit<ProductUserCreationAttributes, "userId"> = {
    externalId: event.userId,
    lastSeenAt: new Date(),
  };
  const traits = event.traits;
  const customTraits = getCustomTraits(event.traits);

  if (typeof getAttribute(traits, "email") !== "undefined") {
    upsertAttrs.email = getAttribute(traits, "email");
  }
  if (typeof getAttribute(traits, "name") !== "undefined") {
    const { firstName, lastName } = parseNameAttribute(traits);
    upsertAttrs.firstName = firstName;
    upsertAttrs.lastName = lastName;
  }
  if (typeof getAttribute(traits, "firstName") !== "undefined") {
    upsertAttrs.firstName = getAttribute(traits, "firstName");
  }
  if (typeof getAttribute(traits, "lastName") !== "undefined") {
    upsertAttrs.lastName = getAttribute(traits, "lastName");
  }
  if (typeof getAttribute(traits, "photo") !== "undefined") {
    upsertAttrs.photo = getAttribute(traits, "photo");
  }
  if (typeof getAttribute(traits, "phone") !== "undefined") {
    upsertAttrs.phone = getAttribute(traits, "phone");
  }
  if (
    typeof getAttribute(traits, "createdAt") !== "undefined" ||
    typeof getAttribute(traits, "signedUpAt") !== "undefined"
  ) {
    let value =
      getAttribute(traits, "createdAt") || getAttribute(traits, "signedUpAt");
    // 946684800000 is year 2000, if the number provided was less than this, then we will multiply by 1000
    // since it's probably number of seconds since epoch start not milliseconds
    if (typeof value === "number" && value < 946684800000) {
      value *= 1000;
    }
    upsertAttrs.signedUpAt = value;
  }
  if (typeof getAttribute(traits, "intercomId") !== "undefined") {
    upsertAttrs.intercomId = getAttribute(traits, "intercomId");
  }
  if (typeof getAttribute(traits, "city") !== "undefined") {
    upsertAttrs.city = getAttribute(traits, "city");
  }
  if (typeof getAttribute(traits, "companyName") !== "undefined") {
    upsertAttrs.companyName = getAttribute(traits, "companyName");
  }
  if (typeof getAttribute(traits, "country") !== "undefined") {
    upsertAttrs.country = getAttribute(traits, "country");
  }
  if (typeof getAttribute(traits, "industry") !== "undefined") {
    upsertAttrs.industry = getAttribute(traits, "industry");
  }
  if (typeof getAttribute(traits, "title") !== "undefined") {
    upsertAttrs.title = getAttribute(traits, "title");
  }
  if (typeof getAttribute(traits, "websiteUrl") !== "undefined") {
    upsertAttrs.websiteUrl = getAttribute(traits, "websiteUrl");
  }
  if (typeof getAttribute(traits, "region") !== "undefined") {
    upsertAttrs.region = getAttribute(traits, "region");
  }
  if (typeof getAttribute(traits, "region") !== "undefined") {
    upsertAttrs.region = getAttribute(traits, "region");
  }
  if (typeof getAttribute(traits, "browser") !== "undefined") {
    upsertAttrs.browser = getAttribute(traits, "browser");
  }
  if (typeof getAttribute(traits, "browserVersion") !== "undefined") {
    upsertAttrs.browserVersion = getAttribute(traits, "browserVersion");
  }
  if (typeof getAttribute(traits, "browserLanguage") !== "undefined") {
    upsertAttrs.browserLanguage = getAttribute(traits, "browserLanguage");
  }
  if (Object.keys(customTraits).length > 0) {
    // https://github.com/sequelize/sequelize/issues/2862#issuecomment-108677901
    // I love this ORM!
    const newTraits = customMerge(productUser.traits, customTraits);
    productUser.set("traits", newTraits);
    productUser.changed("traits", true);
  }
  if (event.context) {
    upsertAttrs.context = event.context;
  }

  productUser.set(upsertAttrs);
  return productUser.save();
};
