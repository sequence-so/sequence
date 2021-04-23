import { Application } from "express";
import SegmentWebook from "../models/segment_webhook";

class Segment {
  constructor(app: Application) {
    app.post("/event/segment", async (req, res) => {
      console.log(req.body);
      const authorization = req.headers.authorization;
      const webhook = await SegmentWebook.findOne({
        where: {
          token: authorization,
        },
      });
      if (!webhook) {
        return res.end(new Error("No webhook found for this token"));
      }

      webhook.executions += 1;
      webhook.lastExecutionAt = new Date();
      await webhook.save();
    });
  }
}

export default Segment;
