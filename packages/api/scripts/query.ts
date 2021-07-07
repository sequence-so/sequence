import env from "dotenv";
env.config();
import { Pool } from "pg";

const pool = new Pool();

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

import Sequence from "sequence-node";
const sequence = new Sequence(process.env.SEQUENCE_DEV_TOKEN, {
  host: "https://api-dev.sequence.so",
});

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

(async () => {
  const client = await pool.connect();

  const result = await client.query(`select count(*) as count
    from flatbed.users u
    join flatbed.organizations o on u.org_id = o.org_id
    join flatbed.user_phones up on up.person_id = u.person_id
    left join flatbed.loads l on u.person_id = l.created_by
    where o.company_code = 'GS' and (l.load_id is NULL OR l.LOAD_STATUS = 'C')`);
  const count = parseInt(result.rows[0].count);
  console.log({ count });

  let curr = 0;
  const limit = 10;
  try {
    while (curr < count) {
      console.log({ curr });
      const res =
        await client.query(`select 'User Signup-' || u.person_id as event_id, u.person_id, u.date_created, u.email_address, u.first_name, u.last_name, o.org_id, o.name as company_name, o.company_code, up.area_code, up.phone_number
        from flatbed.users u
        join flatbed.organizations o on u.org_id = o.org_id
        join flatbed.user_phones up on up.person_id = u.person_id
        left join flatbed.loads l on u.person_id = l.created_by
        where o.company_code = 'GS' and (l.load_id is NULL OR l.LOAD_STATUS = 'C')
        order by u.date_created desc
        LIMIT ${limit} OFFSET ${curr}`);
      const rows = res.rows as DataResult[];
      rows.map((e) => {
        const dataCopy = { ...e };
        delete dataCopy.person_id;
        delete dataCopy.date_created;
        sequence.track({
          event: "User Signup",
          userId: e.person_id,
          properties: dataCopy,
          timestamp: e.date_created,
          messageId: e.event_id,
        });
      });
      curr += limit;
    }
  } finally {
    client.release();
  }
  await sequence.flush();
})();
