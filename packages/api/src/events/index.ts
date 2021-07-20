export * from "./identify.event";
export * from "./track.event";

export type SegmentEventTypes =
  | "track"
  | "identify"
  | "alias"
  | "page"
  | "group";

export type SegmentBase = {
  type: SegmentEventTypes;
  anonymousId: string;
  context?: SegmentContext;
  userId?: string;
  receivedAt: string;
  timestamp: string;
  sentAt: string;
  messageId: string;
  integrations?: Record<string, boolean>;
};

interface SegmentContext {
  library?: {
    sdk: string;
    name: string;
    version: string;
  };
  page?: {
    path: string;
    referrer: string;
    search: string;
    title: string;
    url: string;
  };
  userAgent?: string;
  ip?: string;
}

export interface SegmentTrack extends SegmentBase {
  type: "track";
  event: string;
  originalTimestamp?: string;
  properties: Record<string, any>;
}

export interface SegmentIdentify extends SegmentBase {
  type: "identify";
  channel?: string;
  traits: Record<string, any>;
}

export interface SegmentPage extends SegmentBase {
  type: "page";
  name: string;
  properties: {
    title: string;
    url: string;
  };
}
