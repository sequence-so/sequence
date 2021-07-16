import faker from "faker";
import moment from "moment";
import ProductUser, {
  ProductUserCreationAttributes,
} from "src/models/productUser.model";
import { v4 as uuid } from "uuid";

export const build = (
  opts?: ProductUserCreationAttributes
): ProductUserCreationAttributes => {
  const firstName = opts?.firstName || faker.name.firstName();
  const lastName = opts?.lastName || faker.name.lastName();

  const lastSeenAt = opts?.lastSeenAt || faker.date.recent(30);
  const signedUpAt =
    opts?.signedUpAt || moment(lastSeenAt).subtract(30, "days").toDate();
  const phone =
    opts?.phone || Math.random() < 0.5 ? null : faker.phone.phoneNumber();
  const externalId =
    typeof opts?.externalId === "undefined" ? uuid() : opts.externalId;

  return {
    ...opts,
    lastSeenAt,
    signedUpAt,
    firstName,
    lastName,
    phone,
    email: opts?.email || faker.internet.email(firstName, lastName),
    photo: opts?.photo || faker.image.avatar(),
    externalId,
  };
};

export default async (opts?: ProductUserCreationAttributes) => {
  return await ProductUser.create(build(opts));
};
