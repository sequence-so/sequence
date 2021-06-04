import faker from "faker";
import Event, { EventCreationAttributes } from "src/models/event";
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
    distinctId: opts?.distinctId || uuidv4(),
    messageId: opts?.messageId || uuidv4(),
    name: opts?.name || faker.random.arrayElement(EVENT_LIST),
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
