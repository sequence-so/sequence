import { Application } from "express";
import SegmentWebook from "../models/segment_webhook";
import WebhookExecution from "../models/webhook_execution";

class Segment {
  constructor(app: Application) {
    app.post("/event/segment", async (req, res, next) => {
      console.log(req.body);
      const authorization = req.headers.authorization;
      const webhook = await SegmentWebook.findOne({
        where: {
          token: authorization,
        },
      });
      if (!webhook) {
        return next(new Error("No webhook found for this token"));
      }

      webhook.executions += 1;
      webhook.lastExecutionAt = new Date();
      await webhook.save();
      await WebhookExecution.create({
        type: "segment_webhook",
        webhookId: webhook.id,
        payload: req.body,
        userId: webhook.userId,
      });
      return res.json({
        success: true,
      });
    });
  }
}

export default Segment;
