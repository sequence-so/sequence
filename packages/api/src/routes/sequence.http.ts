import { Application, Request, Response } from "express";
import SequenceWebhook from "../models/sequence_webhook";
import { HttpResponse } from "./segment.http";
import SequenceProcessor from "src/services/sequenceProcessor";
import SequenceError from "src/error/SequenceError";

/**
 * Handles events coming from a Sequence client library or direct API integration.
 */
class SequenceHttpHandler {
  processor: SequenceProcessor;
  constructor(app: Application) {
    this.processor = new SequenceProcessor();
    this.registerRoutes(app);
  }
  registerRoutes(app: Application) {
    app.post(
      "/event/batch",
      this.withAuthentication(this.processor.process.bind(this.processor))
    );
  }
  async getSequenceWebhookForAuthToken(req: Request): Promise<SequenceWebhook> {
    const authorization = req.headers.authorization;
    return SequenceWebhook.findOne({
      where: {
        token: authorization,
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
    handler: (value: SequenceWebhook, body: any) => Promise<HttpResponse>
  ) {
    return async (request: Request, response: Response) => {
      const webhook = await this.getSequenceWebhookForAuthToken(request);
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

export default SequenceHttpHandler;
