import { APIEventPayload } from "sequence-lib";
import Event from "../models/event";
import { createOrUpdateCustomPropertiesTable } from "../utils/getPropertiesFromEvent";
import moment from "moment-timezone";
import { Sequelize } from "sequelize";
import SequelizeDatabase from "../database";

const track = async (
  event: APIEventPayload,
  userId: string,
  source: string,
  sourceId: string
) => {
  if (event.type !== "track") {
    throw new Error(
      `Wrong handler used for event type '${event.type}', expected 'track'`
    );
  }

  const trackEventParams = {
    name: event.name,
    createdAt: moment.tz(event.timestamp, "America/Los_Angeles").toDate(),
    updatedAt: moment.tz(event.timestamp, "America/Los_Angeles").toDate(),
    personId: event.personId,
    messageId: event.messageId,
    properties: event.properties,
    source,
    sourceId,
    type: "track",
    userId,
  };
  console.log({ trackEventParams });
  const trackEvent = await Event.create(trackEventParams);

  // if (event.properties && Object.keys(event.properties).length) {
  //   let newProperties: any = { ...event.properties };
  //   Object.keys(newProperties).forEach((key) => {
  //     if (key.startsWith("$")) {
  //       newProperties["c_" + key.substring(1, key.length)] = newProperties[key];
  //       delete newProperties[key];
  //     }
  //   });
  //   const params = {
  //     ...newProperties,
  //     eventId: trackEvent.id,
  //   };
  //   console.log(params);

  //   const customProperties = await CustomPropertyModel.create(params);
  //   console.log(customProperties);
  // }

  return trackEvent;
};

export default track;
