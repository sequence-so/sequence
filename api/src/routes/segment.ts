import { Application } from "express";
import SegmentWebook from "../models/segment_webhook";
import WebhookExecution from "../models/webhook_execution";

class Segment {
  constructor(app: Application) {
    app.post("/event/segment", async (req, res, next) => {
      console.log(req.body);
      const authorization = req.headers.authorization;
      const passwordString = authorization.split("Basic ")[1];

      const parsedString = Buffer.from(passwordString, "base64").toString(
        "utf8"
      );
      const finalToken = parsedString.substr(0, parsedString.length - 1);

      const webhook = await SegmentWebook.findOne({
        where: {
          token: finalToken,
        },
      });
      if (!webhook) {
        res
          .status(401)
          .json({ success: false, error: "No webhook found for this token" });
        return;
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
