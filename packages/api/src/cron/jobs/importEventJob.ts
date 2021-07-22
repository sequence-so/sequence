import { types } from "pg";
import { Pool, PoolConfig } from "pg";
import Sequence from "sequence-node";
import CronJob from "../cronJob";
import logger from "src/utils/logger";
import EventImport from "src/models/eventImport.model";

// data parsing
types.setTypeParser(types.builtins.INT8, (value: string) => {
  return parseInt(value);
});

types.setTypeParser(types.builtins.FLOAT8, (value: string) => {
  return parseFloat(value);
});

types.setTypeParser(types.builtins.NUMERIC, (value: string) => {
  return parseFloat(value);
});

interface ImportEventJobConfig {
  id: string;
  query: string;
  poolConfig: PoolConfig;
  sequenceToken: string;
  sequenceHost: string;
  highWaterColumn: string;
}

class ImportEventJob extends CronJob {
  sequence: Sequence;
  pool: Pool;
  query: string;
  id: string;
  highWaterColumn: string;
  name = "ImportEventJob";
  constructor(config: ImportEventJobConfig) {
    super();
    this.sequence = new Sequence(config.sequenceToken, {
      host: config.sequenceHost,
    });
    this.query = config.query;
    this.pool = new Pool(config.poolConfig);
    this.id = config.id;
    this.highWaterColumn = config.highWaterColumn;
  }
  importEvents(rows: Record<string, unknown>[]) {
    const first = rows[0];
    if (!first.person_id) {
      throw new Error("Must have a person_id");
    }
    if (!first.date_created) {
      throw new Error("Must have a date_created");
    }
    if (!first.event) {
      throw new Error("Must have an event");
    }
    if (!first.event_id) {
      throw new Error("Must have an event_id");
    }
    const promises = rows.map((e) => {
      const dataCopy = { ...e };
      delete dataCopy.person_id;
      delete dataCopy.date_created;
      delete dataCopy.event;
      delete dataCopy.event_id;
      return this.performTrack({
        event: e.event as string,
        userId: `${e.person_id}` as string,
        properties: dataCopy,
        timestamp: e.date_created as string,
        messageId: e.event_id as string,
      });
    });
    return Promise.all(promises);
  }
  performTrack({
    event,
    userId,
    properties,
    timestamp,
    messageId,
  }: {
    event: string;
    userId: string;
    properties: Record<string, unknown>;
    timestamp: string;
    messageId: string;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      logger.info(`[ImportEventJob:tick] Performing track call`, {
        event,
        userId,
        properties,
        timestamp,
        messageId,
      });
      this.sequence.track(
        {
          event,
          userId,
          properties,
          timestamp,
          messageId,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        }
      );
    });
  }
  async findOrCreateEventImport(): Promise<[EventImport, boolean]> {
    const eventImport = await this.app.models.EventImport.findOrCreate({
      where: {
        type: this.id,
        userId: process.env.EVENT_IMPORT_USER_ID,
      },
    });
    return eventImport;
  }
  getQueryString(highWaterMark: null | string | number | Date): string {
    const highWaterColumn = this.highWaterColumn;
    let newQuery: string = this.query;
    if (highWaterMark === null) {
      return newQuery;
    } else if (typeof highWaterMark === "string") {
      newQuery += ` AND ${highWaterColumn} > '${highWaterMark}'`;
    } else if (typeof highWaterMark === "number") {
      newQuery += ` AND ${highWaterColumn} > ${highWaterMark}`;
    } else {
      newQuery += ` AND ${highWaterColumn} > '${highWaterMark.toUTCString()}'`;
    }
    return newQuery;
  }
  async getSortedRows(query: string) {
    const queryResult = await this.pool.query(query);
    const rows = queryResult.rows;
    if (rows.length === 0) {
      // we got no values
      return [];
    }
    return rows.sort(
      (a, b) =>
        a[this.getHighWaterColumnFmt()] - b[this.getHighWaterColumnFmt()]
    );
  }
  async saveHighWaterMark(
    eventImport: EventImport,
    rows: Record<string, unknown>[]
  ): Promise<EventImport> {
    const lastElement = lastItem(rows);
    if (!lastElement) {
      return;
    }
    let value = lastElement[this.getHighWaterColumnFmt()];
    const type =
      value instanceof Date
        ? "date"
        : typeof value === "string"
        ? "string"
        : typeof value === "number"
        ? "number"
        : "string";
    if (type === "date") {
      value = (value as Date).toISOString();
    }
    logger.info(
      `[ImportEventJob:saveHighWaterMark] ${eventImport.id} Updating import cursor ${value} type ${type}`
    );
    return await eventImport.update({
      cursor: value,
      cursorType: type,
      executedAt: new Date(),
    });
  }
  getHighWaterColumnFmt(): string {
    let newColumn = this.highWaterColumn;
    if (newColumn.indexOf(".") > -1) {
      newColumn = newColumn.split(".")[1];
    }
    return newColumn;
  }
  castHighWaterMark(
    highWaterMark: string,
    highWaterMarkType: string
  ): string | number | Date {
    if (!highWaterMarkType) {
      return highWaterMark;
    }
    if (highWaterMarkType === "string") {
      return highWaterMark;
    }
    if (highWaterMarkType === "number") {
      return Number.parseInt(highWaterMark);
    }
    if (highWaterMarkType === "date") {
      return new Date(highWaterMark);
    }
  }
  loadHighWaterFromModel(eventImport: EventImport) {
    const highWaterMarkType = eventImport.cursorType;
    const highWaterMark = this.castHighWaterMark(
      eventImport.cursor,
      highWaterMarkType
    );
    return { highWaterMark, highWaterMarkType };
  }
  /**
   * 1. Get EventImport model by id
   * 2. If not exists, create a new one
   * 3. Get high water mark from EventImport (null or a value)
   * 4. Perform query with Where > HighWaterMark
   * 5. Get results and push each one over
   * 6. Update high water mark
   */
  async tick(): Promise<void> {
    logger.info("[ImportEventJob:tick] Starting processing...");
    let highWaterMark: string | number | Date;
    const [eventImport, created] = await this.findOrCreateEventImport();
    logger.info(
      `[ImportEventJob:tick] Event Import model id=${eventImport?.id} created=${created}`
    );
    if (created) {
      highWaterMark = null;
    } else {
      const result = this.loadHighWaterFromModel(eventImport);
      highWaterMark = result.highWaterMark;
      logger.info(
        `[ImportEventJob:tick] ${eventImport?.id} highWaterMark=${highWaterMark}`
      );
    }
    const client = await this.pool.connect();
    logger.info(
      `[ImportEventJob:tick] ${eventImport?.id} Connected to datawarehouse`
    );
    // the pool will emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    this.pool.on("error", (err, client) => {
      logger.error("[ImportEvent:tick] Unexpected error on idle client", err);
      process.exit(-1);
    });

    try {
      const queryString = this.getQueryString(highWaterMark);
      logger.info(
        `[ImportEventJob:tick] ${eventImport?.id} Query: ${queryString}`
      );
      const rows = await this.getSortedRows(queryString);
      logger.info(
        `[ImportEventJob:tick] ${eventImport?.id} Fetched ${rows.length} rows`
      );
      if (rows.length === 0) {
        return;
      }
      logger.info(
        `[ImportEventJob:tick] ${eventImport?.id} Importing events...`
      );
      await this.importEvents(rows);
      logger.info(
        `[ImportEventJob:tick] ${eventImport?.id} Saving high water mark...`
      );
      await this.saveHighWaterMark(eventImport, rows);
    } finally {
      client.release();
      await this.sequence.flush();
    }
  }
}

type Maybe<T extends Record<string, unknown>> = T | null;

function lastItem<T extends Record<string, unknown>>(a: Array<T>): Maybe<T> {
  if (a.length === 0) {
    return null;
  }
  return a[a.length - 1];
}

export default ImportEventJob;
