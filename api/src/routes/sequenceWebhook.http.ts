import { Application, NextFunction, Request, Response } from "express";
import { APIEventPayload } from "sequence-lib";
import SequenceWebhook from "../models/sequence_webhook";
import WebhookExecution from "../models/webhook_execution";
import Event from "../models/event";
import NotificationRegistry from "../notifications/notification.registry";
import track from "../events/track.event";
import alias from "../events/alias.event";

interface WebhookPayload {
  batch: APIEventPayload[];
}

class SequenceWebhookRoute {
  constructor(app: Application) {
    app.post("/event/batch", async (req, res) => {
      return this.onEvent(req, res);
    });
  }
  async onEvent(req: Request, res: Response) {
    console.log("Received batch event:" + JSON.stringify(req.body));
    const authorization = req.headers.authorization;
    const token = authorization.split("Bearer ")[1];

    const webhook = await SequenceWebhook.findOne({
      where: {
        token,
      },
    });
    if (!webhook) {
      res
        .status(401)
        .json({ success: false, error: "No webhook found for this token" });
      return;
    }

    const body = req.body as WebhookPayload;

    webhook.executions += 1;
    webhook.lastExecutionAt = new Date();
    await webhook.save();
    const execution = await WebhookExecution.create({
      type: "sequence_webhook",
      webhookId: webhook.id,
      payload: req.body,
      userId: webhook.userId,
    });

    res.json({
      success: true,
    });

    const insertRows: APIEventPayload[] = [];

    for (let idx = 0, len = body.batch.length; idx < len; idx++) {
      const elem = body.batch[idx];
      insertRows.push(elem);
      if (elem.type === "track") {
        track(elem, webhook.userId, execution.type, execution.id);
      } else if (elem.type === "alias") {
        alias(elem, webhook.userId, execution.type, execution.id);
      } else {
        throw new Error(`Invalid type provided: ${elem.type}`);
      }
    }
  }
}

export default SequenceWebhookRoute;
