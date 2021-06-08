import { Application, Request, Response } from "express";
import { EventPayload } from "sequence-node";
import SequenceWebhook from "../models/sequence_webhook";
import WebhookExecution from "../models/webhook_execution";
import { track, identify } from "src/events";
import logger from "src/utils/logger";

interface WebhookPayload {
  batch: EventPayload[];
}

/**
 * Handles events coming from a Sequence client library or direct API integration.
 */
class SequenceHttpHandler {
  constructor(app: Application) {
    app.post("/event/batch", async (req, res) => {
      return this.onEvent(req, res);
    });
  }
  async onEvent(req: Request, res: Response) {
    logger.info(
      "SequenceHttpHandler.onEvent Received batch event:" +
        JSON.stringify(req.body)
    );
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

    const insertRows: EventPayload[] = [];

    for (let idx = 0, len = body.batch.length; idx < len; idx++) {
      const elem = body.batch[idx];
      insertRows.push(elem);
      if (elem.type === "track") {
        track(elem, {
          userId: webhook.userId,
          source: execution.type,
          sourceId: execution.id,
        });
      } else if (elem.type === "identify") {
        identify(elem, {
          userId: webhook.userId,
        });
      } else {
        throw new Error(`Invalid type provided: ${elem.type}`);
      }
    }
  }
}

export default SequenceHttpHandler;
