import Application from "src/app";
import CampaignCronJob from "src/cron/jobs/campaignCronJob";
import CampaignNodeTimeoutJob from "src/cron/jobs/campaignNodeTimeoutCronJob";
import CronRunner from "src/cron/cronRunner";
import appConfig from "src/config/appConfig";
import { CronService } from "src/cron";
import ImportEventJob from "src/cron/jobs/importEventJob";

const app = new Application(appConfig);
const minuteRunner = new CronRunner();
const hourRunner = new CronRunner();

const minuteService = app.getCron();
const hourService = new CronService(app);
app.getCron().registerJobs(new CampaignCronJob(), new CampaignNodeTimeoutJob());
hourService.registerJob(
  new ImportEventJob({
    highWaterColumn: "l.load_id",
    id: "ltl-query",
    query: `
  SELECT
	l.LOAD_ID,
	u.person_id,
	'LTL Shipment Created' as event,
	'LTL Shipment Created-' || l.LOAD_ID as event_id,
	l.DATE_CREATED AS booked_date,
	l.DATE_CREATED AS date_created,
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
		JOIN flatbed.users u on u.org_id = o.org_id
	WHERE
		trunc(l.DATE_CREATED) <= '31-May-2021' AND trunc(l.DATE_CREATED) >= '05-01-2021'`,
    poolConfig: {},
    sequenceHost: process.env.SERVER_HOST,
    sequenceToken: process.env.SEQUENCE_ZANE_TOKEN,
  })
);

minuteRunner.everyMinute(() => {
  minuteService.tick();
});

hourRunner.everyHour(() => {
  hourService.tick();
});
