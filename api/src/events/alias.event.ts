import { APIEventPayload } from "sequence-lib";
import ProductUser from "../models/product_user";

const alias = async (
  event: APIEventPayload,
  userId: string,
  source: string,
  sourceId: string
) => {
  if (event.type !== "alias") {
    throw new Error(
      `Wrong handler used for event type '${event.type}', expected 'alias'`
    );
  }

  let productUser = await ProductUser.findOne({
    where: {
      externalId: event.distinctId,
      userId,
    },
  });

  if (!productUser) {
    productUser = await ProductUser.create({
      email: event.properties.email,
      externalId: event.distinctId,
      firstName: event.properties.firstName,
      lastName: event.properties.lastName,
      photo: event.properties.photo,
      phone: event.properties.phone,
      signedUpAt: event.properties.signedUpAt,
      lastSeenAt: new Date(),
      intercomId: event.properties.intercomId,
      userId,
    });
  } else {
    let upsertAttrs: Record<string, any> = {
      externalId: event.properties.externalId,
      lastSeenAt: new Date(),
    };

    if (event.properties.email) {
      upsertAttrs.email = event.properties.email;
    }
    if (event.properties.firstName) {
      upsertAttrs.firstName = event.properties.firstName;
    }
    if (event.properties.lastName) {
      upsertAttrs.lastName = event.properties.lastName;
    }
    if (event.properties.photo) {
      upsertAttrs.photo = event.properties.photo;
    }
    if (event.properties.phone) {
      upsertAttrs.phone = event.properties.phone;
    }
    if (event.properties.intercomId) {
      upsertAttrs.intercomId = event.properties.intercomId;
    }
    if (event.properties.signedUpAt) {
      upsertAttrs.signedUpAt = event.properties.signedUpAt;
    }
    await productUser.update(upsertAttrs);
  }

  // TODO: Implement Event for track
  return productUser;
};

export default alias;
