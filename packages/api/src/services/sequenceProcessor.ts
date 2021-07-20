import moment from "moment";
import { track, identify } from "src/events";
import SequenceWebhook from "../models/sequenceWebhook.model";
import WebhookExecution from "../models/webhookExecution.model";
import Event from "../models/event.model";
import SequenceError from "src/error/sequenceError";
import logger from "src/utils/logger";
import { v4 as uuid } from "uuid";
import { EventPayload, SequenceEventType } from "sequence-node";

interface WebhookPayload {
  batch: EventPayload[];
}

interface PersonRequestBody {
  browser: string;
  browserLanguage: string;
  browserVersion: string;
  city: string;
  companyName: string;
  country: string;
  email: string;
  externalId: string;
  firstName: string;
  industry: string;
  intercomId: string;
  lastName: string;
  lastSeenAt: Date;
  os: string;
  phone: string;
  photo: string;
  region: string;
  signedUpAt: Date | null;
  title: string;
  websiteUrl: string;
}

/**
 * Segment events are saved in the Events table under columns (source, sourceId) = (SEQUENCE_WEBHOOK_ID, webhookExecution.id)
 */
export const SEQUENCE_WEBHOOK_ID = "segment_webhook";

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
  batch: BatchElement[];
};
type BatchElement = {
  messageId: string;
  success: boolean;
  error?: string;
  processed: boolean;
};

/**
 * Process events coming from Segment.
 */
class SequenceProcessor {
  /**
   * Iterate through each event in the payload and attempt to save it.
   *
   * @param webhook SequenceWebhook
   * @param body Event body
   * @returns
   */
  async process(
    webhook: SequenceWebhook,
    body: WebhookPayload
  ): Promise<{ success: boolean; processed: number; errors: number }> {
    if (!body.batch || !Array.isArray(body.batch)) {
      throw new SequenceError(
        "Request body must specify property `batch` with an array of objects",
        400
      );
    }
    let execution: WebhookExecution;
    const returnResult: HttpBatchEventResponse = {
      success: true,
      total: 0,
      errors: 0,
      processed: 0,
      batch: [],
    };

    let currImportResult: BatchElement;

    // Log this webhook event
    execution = await this.logWebhookEvent(webhook, body);

    // Process each event and increment status counters
    for (let idx = 0, len = body.batch.length; idx < len; idx++) {
      try {
        const elem = body.batch[idx];

        currImportResult = {
          messageId: elem.messageId,
          success: true,
          processed: false,
        };

        const result = await this.handleEvent(elem, execution);
        if (result.processed) {
          returnResult.processed++;
          currImportResult.processed = true;
        }
        if (!result.success) {
          returnResult.errors++;
          currImportResult.success = false;
        }
        returnResult.batch.push(currImportResult);
      } catch (error) {
        logger.error("[SequenceProcessor:process] " + error.stack);
        currImportResult.success = false;
        currImportResult.error = "An error occured processing the event";
        returnResult.batch.push(currImportResult);
      }
      returnResult.total++;
    }

    return returnResult;
  }

  /**
   * Process an API call to create a User.
   *
   * @param webhook SequenceWebhook
   * @param body Event body
   * @returns
   */
  async processIdentify(
    webhook: SequenceWebhook,
    body: PersonRequestBody
  ): Promise<{ success: boolean; processed: number; errors: number }> {
    const traits = { ...body };
    delete traits.externalId;
    const identifyParams: EventPayload = {
      type: "identify" as SequenceEventType,
      messageId: uuid(),
      receivedAt: new Date(),
      sentAt: new Date(),
      timestamp: new Date().toISOString(),
      traits: traits,
      userId: body.externalId,
      context: {},
    };
    return this.process(webhook, {
      batch: [identifyParams],
    });
  }

  /**
   * Logs the execution of webhook.
   *
   * @param webhook SequenceWebhook
   * @param body Request body
   * @returns WebhookExecution
   */
  async logWebhookEvent(
    webhook: SequenceWebhook,
    body: any
  ): Promise<WebhookExecution> {
    await webhook.update({
      execution: webhook.executions + 1,
      lastExecutionAt: new Date(),
    });
    return WebhookExecution.create({
      type: SEQUENCE_WEBHOOK_ID,
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
    event: EventPayload,
    webhook: WebhookExecution
  ): Promise<ProcessedEvent> {
    if (!event.messageId) {
      logger.info(
        "[SequenceProcessor.handleEvent] No messageId receieved, assigning a messageId"
      );
      event.messageId = uuid();
    }

    let existing: any;
    if (event.type === "track") {
      existing = await Event.findOne({
        where: {
          userId: webhook.userId,
          messageId: event.messageId,
        },
      });
    } else if (event.type === "identify") {
      // TODO: Identify calls don't support idempotency!
    }

    if (existing) {
      logger.info(
        "SequenceProcessor.handleEvent Duplicate messageId receieved, skipping: " +
          event.messageId
      );
      return {
        success: true,
        processed: false,
      };
    }

    if (event.type === "identify") {
      await identify(
        {
          type: "identify",
          traits: event.traits,
          userId: event.userId,
          context: event.context,
          messageId: event.messageId,
          receivedAt: new Date(),
          sentAt: moment(event.sentAt || new Date()).toDate(),
          timestamp: moment(event.timestamp).toDate(),
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
          timestamp: moment(event.timestamp).toDate(),
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

export default SequenceProcessor;
