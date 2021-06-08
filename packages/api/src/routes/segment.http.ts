import { Application, Request, Response } from "express";
import SegmentWebook from "../models/segment_webhook";
import SegmentProcessor from "src/services/segmentProcessor";
import SegmentWebhook from "../models/segment_webhook";
import SequenceError from "src/error/SequenceError";

export interface HttpResponse extends Record<string, any> {
  success: boolean;
}

/**
 * Handle HTTP requests for Segment data import routes.
 */
class SegmentHttpHandler {
  processor: SegmentProcessor;
  constructor(app: Application) {
    this.processor = new SegmentProcessor();
    this.registerRoutes(app);
  }
  /**
   * Registers the routes.
   *
   * @param app Application
   */
  registerRoutes(app: Application) {
    app.post(
      "/event/segment/subscription",
      this.withAuthentication(this.processor.process.bind(this.processor))
    );
    app.post(
      "/event/segment",
      this.withAuthentication(this.processor.process.bind(this.processor))
    );
  }
  async getSegmentWebhookForAuthToken(req: Request): Promise<SegmentWebook> {
    const authorization = req.headers.authorization;
    return SegmentWebook.findOne({
      where: {
        token: authorization,
      },
    });
  }
  async authenticate(req: Request) {
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
  /**
   * Wraps the route handler in a middleware that authenticates the SegmentWebhook and if successful,
   * executes the handler with with SegmentWebhook model and the request body as an argument.
   *
   * @param handler Function to execute after authentication passes
   * @returns Response
   */
  withAuthentication(
    handler: (value: SegmentWebhook, body: any) => Promise<HttpResponse>
  ) {
    return async (request: Request, response: Response) => {
      const webhook = await this.getSegmentWebhookForAuthToken(request);
      if (!webhook) {
        return response
          .status(401)
          .json({ success: false, error: "No webhook found for this token" });
      }
      try {
        const result = await handler(webhook, request.body);
        return response.json(result);
      } catch (error) {
        if ((error as SequenceError).statusCode) {
          let sequenceError = error as SequenceError;
          return response
            .status(sequenceError.statusCode)
            .json(sequenceError.payload);
        }
        return response.status(500).json({
          sucess: false,
          message: (error as any).message,
        });
      }
    };
  }
}

export default SegmentHttpHandler;
