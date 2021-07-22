import { expect } from "chai";
import { stub, spy } from "sinon";
import App from "src/app";
import ImportEventJob from "src/cron/jobs/importEventJob";
import EventImport from "src/models/eventImport.model";
import User from "src/models/user.model";
import userSeed from "tests/seeds/user.seed";

let app: App;
let user: User;

const query = `SELECT
	l.LOAD_ID,
	l.DATE_CREATED AS booked_date,
	lst.DESCRIPTION AS LOAD_STATUS,
	o.name AS customer_name,
	lcd.TOTAL_REVENUE,
	lcd.TOTAL_COSTS,
	lcd.TOTAL_REVENUE - lcd.TOTAL_COSTS AS margin,
	(
		SELECT
			min(l2.date_created)
		FROM
			flatbed.loads l2
		WHERE
			l2.ORG_ID = o.ORG_ID
	) AS first_load_date,
	(
		SELECT
			min(l2.SHIP_DATE)
		FROM
			flatbed.loads l2
		WHERE
			l2.ORG_ID = o.ORG_ID
	) AS first_ship_date, l.CONTAINER_CD AS container_type
	FROM
		flatbed.loads l
		JOIN flatbed.organizations o ON o.ORG_ID = l.ORG_ID
			AND l.ORIGINATING_SYSTEM = 'GS'
			AND l.LOAD_STATUS != 'C'
		JOIN flatbed.LOAD_STATUS_TYPES lst ON lst.LOAD_STATUS = l.LOAD_STATUS
		JOIN rater.load_cost_details lcd ON lcd.load_id = l.load_id
			AND lcd.STATUS = 'A'
	WHERE
		trunc(l.DATE_CREATED) <= '31-May-2021'`;

describe.only("import event job", function () {
  before(async () => {
    app = new App();
    user = await userSeed();
  });
  after(async () => {
    await EventImport.destroy({
      where: {
        userId: user.id,
      },
      force: true,
    });
    await user.destroy();
  });

  it("should build the correct query string", async () => {
    const job = new ImportEventJob({
      highWaterColumn: "l.load_id",
      id: "my-query",
      poolConfig: {},
      query: query,
      sequenceHost: "test",
      sequenceToken: "test",
    });
    expect(job.getQueryString(14328660)).toMatchSnapshot();

    const job2 = new ImportEventJob({
      highWaterColumn: "trunc(l.DATE_CREATED)",
      id: "my-query",
      poolConfig: {},
      query: query,
      sequenceHost: "test",
      sequenceToken: "test",
    });
    expect(job2.getQueryString("01-01-2021")).toMatchSnapshot();

    expect(job.getQueryString(null)).toMatchSnapshot();
  });
  it("should load the correct previous cursor", async () => {
    const highWaterColumn = "l.load_id";
    const job = new ImportEventJob({
      highWaterColumn,
      id: "my-query",
      poolConfig: {},
      query: query,
      sequenceHost: "test",
      sequenceToken: "test",
    });
    const eventImport = await EventImport.create({
      type: "ltl-query",
      userId: user.id,
      cursor: "1000",
      cursorType: "number",
    });
    let { highWaterMark, highWaterMarkType } =
      job.loadHighWaterFromModel(eventImport);
    expect(highWaterMark).to.eq(1000);
    expect(highWaterMarkType).to.eq("number");
    const date = new Date();
    eventImport.update({
      cursor: date.toISOString(),
      cursorType: "date",
    });
    ({ highWaterMark, highWaterMarkType } =
      job.loadHighWaterFromModel(eventImport));
    expect(highWaterMark).to.deep.eq(date);
    expect(highWaterMarkType).to.eq("date");
    eventImport.update({
      cursor: "my cursor",
      cursorType: "string",
    });
    ({ highWaterMark, highWaterMarkType } =
      job.loadHighWaterFromModel(eventImport));
    expect(highWaterMark).to.eq("my cursor");
    expect(highWaterMarkType).to.eq("string");
  });
  it("should sort rows", async () => {
    const highWaterColumn = "l.load_id";
    const job = new ImportEventJob({
      highWaterColumn,
      id: "my-query",
      poolConfig: {},
      query: query,
      sequenceHost: "test",
      sequenceToken: "test",
    });
    const qs = job.getQueryString(14337114);
    const rows = await job.getSortedRows(qs);
    const copy = [...rows];
    expect(rows[0][job.highWaterColumn]).to.be.undefined;
    expect(rows[0][job.getHighWaterColumnFmt()]).to.not.be.undefined;
    copy.sort((a, b) => {
      if (a[job.getHighWaterColumnFmt()] < b[job.getHighWaterColumnFmt()]) {
        return -1;
      }
      if (a[job.getHighWaterColumnFmt()] > b[job.getHighWaterColumnFmt()]) {
        return 1;
      }
      return 0;
    });
    expect(copy).to.deep.eq(rows);
  });
  it("should perform event validation", async () => {
    const highWaterColumn = "l.load_id";
    const job = new ImportEventJob({
      highWaterColumn,
      id: "my-query",
      poolConfig: {},
      query: query,
      sequenceHost: "test",
      sequenceToken: "test",
    });
    expect(() => job.importEvents([{}])).to.throw(/Must have a person_id/);
    expect(() =>
      job.importEvents([
        {
          person_id: 10,
        },
      ])
    ).to.throw(/Must have a date_created/);
    expect(() =>
      job.importEvents([
        {
          person_id: 10,
          date_created: "2021-05-11 00:32:57",
        },
      ])
    ).to.throw(/Must have an event/);
    expect(() =>
      job.importEvents([
        {
          person_id: 10,
          date_created: "2021-05-11 00:32:57",
          event: "LTL Shipment Created",
        },
      ])
    ).to.throw(/Must have an event_id/);
  });
  it("should send events to sequence", () => {
    const highWaterColumn = "l.load_id";
    const job = new ImportEventJob({
      highWaterColumn,
      id: "my-query",
      poolConfig: {},
      query: query,
      sequenceHost: "test",
      sequenceToken: "test",
    });
    const fn = spy();
    stub(job, "performTrack").callsFake(fn);
    job.importEvents([
      {
        person_id: 10,
        date_created: "2021-05-11 00:32:57",
        event: "LTL Shipment Created",
        event_id: "LTL Shipment Created-14334980",
        booked_date: "2021-05-11 00:32:57",
        load_status: "Confirmed Delivery",
        customer_name: "Millight Group",
        total_revenue: 418.06,
        total_costs: 281.56,
        container_type: "VANLTL",
      },
    ]);
    expect(fn.args[0][0]).to.deep.eq({
      event: "LTL Shipment Created",
      messageId: "LTL Shipment Created-14334980",
      timestamp: "2021-05-11 00:32:57",
      userId: "10",
      properties: {
        booked_date: "2021-05-11 00:32:57",
        load_status: "Confirmed Delivery",
        customer_name: "Millight Group",
        total_revenue: 418.06,
        total_costs: 281.56,
        container_type: "VANLTL",
      },
    });
  });
  it("should save high water mark", async () => {
    const highWaterColumn = "l.load_id";
    const job = new ImportEventJob({
      highWaterColumn,
      id: "my-query",
      poolConfig: {},
      query: query,
      sequenceHost: "test",
      sequenceToken: "test",
    });

    const eventImport = await EventImport.create({
      type: "ltl-query",
      userId: user.id,
      cursor: null,
    });
    await job.saveHighWaterMark(eventImport, [
      {
        load_id: 14322692,
      },
    ]);
    await eventImport.reload();
    expect(eventImport.cursor).to.eq("14322692");
    expect(eventImport.cursorType).to.eq("number");
    expect(eventImport.executedAt).to.not.be.undefined;
    await job.saveHighWaterMark(eventImport, [
      {
        load_id: "14322692",
      },
    ]);
    await eventImport.reload();
    expect(eventImport.cursor).to.eq("14322692");
    expect(eventImport.cursorType).to.eq("string");
    const date = new Date();
    await job.saveHighWaterMark(eventImport, [
      {
        load_id: date,
      },
    ]);
    await eventImport.reload();
    expect(eventImport.cursor).to.eq(date.toISOString());
    expect(eventImport.cursorType).to.eq("date");
  });
});
