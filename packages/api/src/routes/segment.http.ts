import { Application, Request } from "express";
import SegmentWebook from "../models/segment_webhook";
import WebhookExecution from "../models/webhook_execution";
import Event from "../models/event";

// ignore "group" type
type SegmentEventTypes = "track" | "identify" | "alias" | "page";

type SegmentBase = {
  type: SegmentEventTypes;
  anonymousId: string;
  context: SegmentContext;
  userId?: string;
  receivedAt: string;
  timestamp: string;
  sentAt: string;
  messageId: string;
  integrations: Record<string, boolean>;
};

interface SegmentContext {
  library: {
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
  userAgent: string;
  ip: string;
}

interface SegmentTrack extends SegmentBase {
  type: "track";
  event: string;
  originalTimestamp: string;
  properties: Record<string, any>;
}

interface SegmentIdentify extends SegmentBase {
  type: "identify";
  channel: string;
  traits: Record<string, any>;
}

interface SegmentPage extends SegmentBase {
  type: "page";
  name: string;
  properties: {
    title: string;
    url: string;
  };
}

class Segment {
  constructor(app: Application) {
    app.post("/event/segment/subscription", async (req, res, next) => {
      const webhook = await this.getWebhookSegmentSubscription(req);
      if (!webhook) {
        res
          .status(401)
          .json({ success: false, error: "No webhook found for this token" });
        return;
      }

      let execution: WebhookExecution;
      try {
        execution = await this.updateWebhook(webhook, req.body);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
        });
      }

      try {
        this.process(req.body as any, execution);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }

      return res.json({
        success: true,
      });
    });
    app.post("/event/segment", async (req, res, next) => {
      console.log(req.body);
      const authorization = req.headers.authorization;

      const webhook = await SegmentWebook.findOne({
        where: {
          token: authorization,
        },
      });
      if (!webhook) {
        res
          .status(401)
          .json({ success: false, error: "No webhook found for this token" });
        return;
      }

      const execution = await this.updateWebhook(webhook, req.body);

      this.process(req.body as any, execution);

      return res.json({
        success: true,
      });
    });
  }
  async getWebhookSegmentSubscription(req: Request): Promise<SegmentWebook> {
    const authorization = req.headers.authorization;
    const passwordString = authorization.split("Basic ")[1];

    const parsedString = Buffer.from(passwordString, "base64").toString("utf8");
    const finalToken = parsedString.substr(0, parsedString.length - 1);

    return SegmentWebook.findOne({
      where: {
        token: finalToken,
      },
    });
  }
  async updateWebhook(
    webhook: SegmentWebook,
    body: any
  ): Promise<WebhookExecution> {
    webhook.executions += 1;
    webhook.lastExecutionAt = new Date();
    await webhook.save();
    const execution = await WebhookExecution.create({
      type: "segment_webhook",
      webhookId: webhook.id,
      payload: body,
      userId: webhook.userId,
    });
    return execution;
  }
  async process(
    event: SegmentIdentify | SegmentTrack | SegmentPage,
    source: WebhookExecution
  ) {
    try {
      if (event.type === "identify") {
        await Event.create({
          distinctId: event.userId,
          name: "$identify",
          messageId: event.messageId,
          properties: event.traits,
          source: source.type,
          sourceId: source.id,
          userId: source.userId,
          type: "identify",
          createdAt: new Date(event.timestamp),
          updatedAt: new Date(event.timestamp),
        });
      } else if (event.type === "page") {
        await Event.create({
          distinctId: event.userId,
          name: "$page",
          messageId: event.messageId,
          properties: event.properties,
          source: source.type,
          sourceId: source.id,
          userId: source.userId,
          type: "page",
          createdAt: new Date(event.timestamp),
          updatedAt: new Date(event.timestamp),
        });
      } else if (event.type === "track") {
        await Event.create({
          distinctId: event.userId,
          name: event.event,
          messageId: event.messageId,
          properties: event.properties,
          source: source.type,
          sourceId: source.id,
          userId: source.userId,
          type: "page",
          createdAt: new Date(event.timestamp),
          updatedAt: new Date(event.timestamp),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default Segment;
