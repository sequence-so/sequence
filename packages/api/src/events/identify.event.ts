import { EventPayload } from "sequence-node";
import ProductUser, {
  ProductUserCreationAttributes,
  VALID_KEYS,
} from "../models/productUser.model";
import merge from "lodash/merge";

export const getCustomTraits = (traits: Record<string, any>) => {
  const customTraits: Record<string, any> = {};

  Object.keys(traits).forEach((key: string) => {
    if (typeof (VALID_KEYS as any)[key] === "undefined") {
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
  Object.keys(b).forEach((key) => {
    if (b[key] === undefined || b[key] === null) {
      delete newTraits[key];
    }
  });
  return newTraits;
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

  const productUser = await ProductUser.findOne({
    where: {
      externalId: event.userId,
      userId: meta.userId,
    },
  });

  if (!productUser) {
    const traits: Record<string, any> = event.traits || {};
    const customTraits = getCustomTraits(traits);
    return ProductUser.create({
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
      traits: customTraits,
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
  debugger;
  if (typeof traits.email !== "undefined") {
    upsertAttrs.email = traits.email;
  }
  if (typeof traits.firstName !== "undefined") {
    upsertAttrs.firstName = traits.firstName;
  }
  if (typeof traits.lastName !== "undefined") {
    upsertAttrs.lastName = traits.lastName;
  }
  if (typeof traits.photo !== "undefined") {
    upsertAttrs.photo = traits.photo;
  }
  if (typeof traits.phone !== "undefined") {
    upsertAttrs.phone = traits.phone;
  }
  if (typeof traits.createdAt !== "undefined") {
    upsertAttrs.signedUpAt = traits.signedUpAt;
  }
  if (typeof traits.intercomId !== "undefined") {
    upsertAttrs.intercomId = traits.intercomId;
  }
  if (typeof traits.city !== "undefined") {
    upsertAttrs.city = traits.city;
  }
  if (typeof traits.companyName !== "undefined") {
    upsertAttrs.companyName = traits.companyName;
  }
  if (typeof traits.country !== "undefined") {
    upsertAttrs.country = traits.country;
  }
  if (typeof traits.industry !== "undefined") {
    upsertAttrs.industry = traits.industry;
  }
  if (typeof traits.title !== "undefined") {
    upsertAttrs.title = traits.title;
  }
  if (typeof traits.websiteUrl !== "undefined") {
    upsertAttrs.websiteUrl = traits.websiteUrl;
  }
  if (typeof traits.region !== "undefined") {
    upsertAttrs.region = traits.region;
  }
  if (typeof traits.region !== "undefined") {
    upsertAttrs.region = traits.region;
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
  if (typeof traits.browser !== "undefined") {
    upsertAttrs.browser = traits.browser;
  }
  if (typeof traits.browserVersion !== "undefined") {
    upsertAttrs.browserVersion = traits.browserVersion;
  }
  if (typeof traits.browserLanguage !== "undefined") {
    upsertAttrs.browserLanguage = traits.browserLanguage;
  }
  productUser.set(upsertAttrs);
  return productUser.save();
};
