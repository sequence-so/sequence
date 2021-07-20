import CronJob from "../cronJob";
import { Pool, PoolClient } from "pg";
import Sequence from "sequence-node";
import logger from "src/utils/logger";
import Query from "src/importer/query";
import EventImport from "src/models/eventImport.model";

interface DataResult {
  event_id: string;
  person_id: string;
  date_created: Date;
  email_address: string;
  first_name: string;
  last_name: string;
  org_id: string;
  company_name: string;
  company_code: string;
  area_code: string;
  phone_number: string;
}

const loadEvent = new Query();
loadEvent.name = "User Signup";
loadEvent.query = `select 'User Signup-' || u.person_id as event_id, u.person_id, u.date_created, u.email_address, u.first_name, u.last_name, o.org_id, o.name as company_name, o.company_code, up.area_code, up.phone_number
from flatbed.users u
join flatbed.organizations o on u.org_id = o.org_id
join flatbed.user_phones up on up.person_id = u.person_id
left join flatbed.loads l on u.person_id = l.created_by
where o.company_code = 'GS' and (l.load_id is NULL OR l.LOAD_STATUS = 'C')
order by u.date_created desc
LIMIT %s OFFSET %s`;

class ImportEventJob extends CronJob {
  sequence: Sequence;
  pool: Pool;
  constructor() {
    super();
    this.sequence = new Sequence(process.env.SEQUENCE_DEV_TOKEN, {
      host: process.env.SERVER_HOST,
    });
    this.pool = new Pool();
  }
  async executeImport(client: PoolClient, eventImport: EventImport) {
    const result = await client.query(`select count(*) as count
    from flatbed.users u
    join flatbed.organizations o on u.org_id = o.org_id
    join flatbed.user_phones up on up.person_id = u.person_id
    left join flatbed.loads l on u.person_id = l.created_by
    where o.company_code = 'GS' and (l.load_id is NULL OR l.LOAD_STATUS = 'C')`);
    const count = parseInt(result.rows[0].count);
    logger.info(`[ImportEvent:tick] got ${count} rows for type `);
    console.log({ count });

    let curr = 0;
    const limit = 10;
    while (curr < count) {
      const queryString = loadEvent.parse({ limit, offset: curr });
      const res = await client.query(queryString);
      const rows = res.rows as DataResult[];
      rows.map((e) => {
        const dataCopy = { ...e };
        delete dataCopy.person_id;
        delete dataCopy.date_created;
        this.sequence.track({
          event: loadEvent.name,
          userId: e.person_id,
          properties: dataCopy,
          timestamp: e.date_created,
          messageId: e.event_id,
        });
      });
      curr += limit;
    }
  }
  async tick(): Promise<void> {
    const eventImports = await this.app.models.EventImport.findAll();
    const client = await this.pool.connect();

    // the pool will emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    this.pool.on("error", (err, client) => {
      logger.error("[ImportEvent:tick] Unexpected error on idle client", err);
      process.exit(-1);
    });

    try {
      eventImports.map((eventImport) =>
        this.executeImport(client, eventImport)
      );
    } finally {
      client.release();
      await this.sequence.flush();
    }
  }
}

export default ImportEventJob;
