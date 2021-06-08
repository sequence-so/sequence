import { EventPayload } from "sequence-node";
import ProductUser, {
  ProductUserCreationAttributes,
  VALID_KEYS,
} from "src/models/product_user";
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

  if (traits.email) {
    upsertAttrs.email = traits.email;
  }
  if (traits.firstName) {
    upsertAttrs.firstName = traits.firstName;
  }
  if (traits.lastName) {
    upsertAttrs.lastName = traits.lastName;
  }
  if (traits.photo) {
    upsertAttrs.photo = traits.photo;
  }
  if (traits.phone) {
    upsertAttrs.phone = traits.phone;
  }
  if (traits.createdAt) {
    upsertAttrs.signedUpAt = traits.signedUpAt;
  }
  if (traits.intercomId) {
    upsertAttrs.intercomId = traits.intercomId;
  }
  if (traits.city) {
    upsertAttrs.city = traits.city;
  }
  if (traits.companyName) {
    upsertAttrs.companyName = traits.companyName;
  }
  if (traits.country) {
    upsertAttrs.country = traits.country;
  }
  if (traits.industry) {
    upsertAttrs.industry = traits.industry;
  }
  if (traits.title) {
    upsertAttrs.title = traits.title;
  }
  if (traits.websiteUrl) {
    upsertAttrs.websiteUrl = traits.websiteUrl;
  }
  if (traits.region) {
    upsertAttrs.region = traits.region;
  }
  if (traits.region) {
    upsertAttrs.region = traits.region;
  }
  if (Object.keys(customTraits).length > 0) {
    // https://github.com/sequelize/sequelize/issues/2862#issuecomment-108677901
    // I love this ORM!
    productUser.set("traits", merge(productUser.traits, customTraits));
    productUser.changed("traits", true);
  }
  if (event.context) {
    upsertAttrs.context = event.context;
  }
  if (traits.browser) {
    upsertAttrs.browser = traits.browser;
  }
  if (traits.browserVersion) {
    upsertAttrs.browserVersion = traits.browserVersion;
  }
  if (traits.browserLanguage) {
    upsertAttrs.browserLanguage = traits.browserLanguage;
  }
  productUser.set(upsertAttrs);
  return productUser.save();
};
