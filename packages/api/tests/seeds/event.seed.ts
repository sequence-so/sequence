import faker from "faker";
import Event, { EventCreationAttributes } from "src/models/event.model";
import { v4 as uuidv4 } from "uuid";
import { EVENT_LIST } from "./eventList";

interface EventSeedCreationAttributes extends Partial<EventCreationAttributes> {
  userId: string;
}

export const build = (
  opts?: EventSeedCreationAttributes
): EventCreationAttributes => {
  return {
    ...opts,
    type: "track",
    personId: opts?.personId || uuidv4(),
    messageId: opts?.messageId || uuidv4(),
    name: opts?.name || faker.random.arrayElement(EVENT_LIST),
    sentAt: opts?.sentAt || new Date(),
    context: opts?.context || {},
    timestamp: opts?.timestamp || new Date(),
    receivedAt: opts?.receivedAt || new Date(),
  };
};

export const track = (opts?: EventSeedCreationAttributes) => {
  return Event.create(build({ ...opts, type: "track" }));
};

export const alias = (opts?: EventSeedCreationAttributes) => {
  return Event.create(build({ ...opts, type: "alias" }));
};

const EventSeed = (opts?: EventSeedCreationAttributes) => {
  return Event.create(build(opts));
};

export default EventSeed;
