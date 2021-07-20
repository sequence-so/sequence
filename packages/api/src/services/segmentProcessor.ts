import moment from "moment";
import {
  SegmentIdentify,
  SegmentPage,
  SegmentTrack,
  track,
  identify,
} from "src/events";
import SegmentWebhook from "../models/segmentWebhook.model";
import SegmentWebook from "../models/segmentWebhook.model";
import WebhookExecution from "../models/webhookExecution.model";
import Event from "../models/event.model";
import SequenceError from "src/error/sequenceError";
import logger from "src/utils/logger";

/**
 * Segment events are saved in the Events table under columns (source, sourceId) = (SEGMENT_WEBHOOK_ID, webhookExecution.id)
 */
export const SEGMENT_WEBHOOK_ID = "segment_webhook";

type RequestBody = Record<string, unknown>;
type ProcessedEvent = {
  success: boolean;
  processed: boolean;
};
type HttpBatchEventResponse = {
  success: boolean;
  total: number;
  errors: number;
  processed: number;
  error?: string;
  batch: {
    messageId: string;
    success: boolean;
    error?: string;
    processed: boolean;
  }[];
};

/**
 * Process events coming from Segment.
 */
class SegmentProcessor {
  /**
   * Entry function for this processor.
   *
   * @param webhook SegmentWebhook
   * @param body Event body
   * @returns
   */
  async process(
    webhook: SegmentWebhook,
    body: RequestBody
  ): Promise<HttpBatchEventResponse> {
    let execution: WebhookExecution;
    const returnResult: HttpBatchEventResponse = {
      success: true,
      total: 0,
      errors: 0,
      processed: 0,
      batch: [],
    };
    const curr = {
      messageId: body.messageId as string,
      success: true,
      processed: false,
    };
    try {
      execution = await this.logWebhookEvent(webhook, body);
      const result = await this.handleEvent(body as any, execution);
      returnResult.total++;

      if (result.processed) {
        returnResult.processed++;
        curr.processed = result.processed;
      }
      if (!result.success) {
        returnResult.errors++;
        curr.success = result.success;
      }
      returnResult.batch.push(curr);
    } catch (error) {
      logger.error("SegmentProcess.process:" + error.stack);
      throw new SequenceError("An error occured processing the event", 500);
    }
    return returnResult;
  }
  /**
   * Logs the execution of webhook.
   *
   * @param webhook SegmentWebhook
   * @param body Request body
   * @returns WebhookExecution
   */
  async logWebhookEvent(
    webhook: SegmentWebook,
    body: any
  ): Promise<WebhookExecution> {
    await webhook.update({
      execution: webhook.executions + 1,
      lastExecutionAt: new Date(),
    });
    return WebhookExecution.create({
      type: SEGMENT_WEBHOOK_ID,
      payload: body,
      webhookId: webhook.id,
      userId: webhook.userId,
    });
  }
  /**
   * Processes an event from Segment.
   *
   * @param event A Segment event
   * @param webhook WebhookExecution
   * @returns
   */
  async handleEvent(
    event: SegmentIdentify | SegmentTrack | SegmentPage,
    webhook: WebhookExecution
  ): Promise<ProcessedEvent> {
    if (!event.messageId) {
      logger.info(
        "SegmentProcessor.handleEvent No messageId receieved, skipping"
      );
      throw new Error("No message ID generated by client");
    }

    const existing = await Event.findOne({
      where: {
        userId: webhook.userId,
        messageId: event.messageId,
      },
    });

    if (existing) {
      logger.info(
        "SegmentProcessor.handleEvent Duplicate messageId receieved, skipping: " +
          event.messageId
      );
      return {
        success: true,
        processed: false,
      };
    }

    if (event.type === "identify") {
      // not yet supported
      if (
        event.anonymousId &&
        (typeof event.userId === "undefined" || !event.userId)
      ) {
        logger.info(
          "SegmentProcessor.handleEvent Received anonymousId identify, skipping: " +
            event.anonymousId
        );
        return {
          success: true,
          processed: false,
        };
      }

      await identify(
        {
          type: "identify",
          traits: event.traits,
          userId: event.userId,
          context: event.context,
          messageId: event.messageId,
          receivedAt: new Date(),
          sentAt: moment(event.sentAt || new Date()).toDate(),
          timestamp: moment(event.timestamp || new Date()).toDate(),
        },
        {
          userId: webhook.userId,
        }
      );
    } else if (event.type === "track") {
      await track(
        {
          type: "track",
          event: event.event,
          userId: event.userId,
          context: event.context,
          messageId: event.messageId,
          properties: event.properties,
          receivedAt: new Date(),
          sentAt: moment(event.sentAt || new Date()).toDate(),
          timestamp: moment(event.timestamp || new Date()).toDate(),
        },
        {
          userId: webhook.userId,
          source: webhook.type,
          sourceId: webhook.id,
        }
      );
    }
    return {
      success: true,
      processed: true,
    };
  }
}

export default SegmentProcessor;
