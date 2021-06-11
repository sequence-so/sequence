import { EventPayload } from "sequence-node";
import Event, { EventCreationAttributes } from "../models/event.model";

/**
 * Saves the `track` event type to the database.
 *
 * @param event
 * @param meta
 * @returns
 */
export async function track(
  event: EventPayload,
  meta: {
    userId: string;
    source: string;
    sourceId: string;
  }
): Promise<Event> {
  if (event.type !== "track") {
    throw new Error(
      `Wrong handler used for event type '${event.type}', expected 'track'`
    );
  }

  const trackEventParams: EventCreationAttributes = {
    type: "track",
    name: event.event,
    context: event.context,
    timestamp: new Date(event.timestamp),
    sentAt: event.sentAt,
    receivedAt: event.receivedAt,
    personId: event.userId,
    messageId: event.messageId,
    properties: event.properties,
    source: meta.source,
    sourceId: meta.sourceId,
    userId: meta.userId,
  };

  return Event.create(trackEventParams);
}
