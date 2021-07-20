import { Application, Request, Response } from "express";
import SequenceWebhook from "../models/sequenceWebhook.model";
import { HttpResponse } from "./segment.http";
import SequenceProcessor from "src/services/sequenceProcessor";
import SequenceError from "src/error/sequenceError";
import logger from "src/utils/logger";
import { basicAuthentication } from "src/auth/basic.auth";

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
    app.post(
      "/user",
      this.withAuthentication(
        this.processor.processIdentify.bind(this.processor)
      )
    );
  }
  async getSequenceWebhookForAuthToken(req: Request): Promise<SequenceWebhook> {
    let sequenceWebhook: SequenceWebhook;
    try {
      const payload = await basicAuthentication(req.headers.authorization);
      sequenceWebhook = payload.token;
    } catch (error) {
      const authorization = req.headers.authorization;
      const string = authorization.split("Bearer ");
      let token: string;
      if (string.length === 2) {
        token = string[1];
      } else {
        throw new Error(
          "Invalid authorization header provided, expected `Authorization: Basic [token]`"
        );
      }
      sequenceWebhook = await SequenceWebhook.findOne({
        where: {
          token,
        },
      });
    }
    return sequenceWebhook;
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
        logger.info("[Sequence:HTTP] Handling batch import");
        const result = await handler(webhook, request.body);
        return response.json(result);
      } catch (error) {
        if ((error as SequenceError).statusCode) {
          const sequenceError = error as SequenceError;
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
