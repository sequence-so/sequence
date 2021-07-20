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

  const firstQuery = async () => {
    const result = await client.query(`select count(*) as count
      from flatbed.users u
      join flatbed.organizations o on u.org_id = o.org_id
      join flatbed.user_phones up on up.person_id = u.person_id
      left join flatbed.loads l on u.person_id = l.created_by
      where o.company_code = 'GS' and (l.load_id is NULL OR l.LOAD_STATUS = 'C')`);
    const count = parseInt(result.rows[0].count);
    let curr = 0;
    const limit = 10;

    while (curr < count) {
      console.log("User Signup " + { curr, count });
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
  };

  const secondQuery = async () => {
    const result = await client.query(`select count(*)
    from pls.load l
    join pls.customer c on l.customer_id = c.customer_id
    join pls.equipments e on e.equipments_id = l.equipment_id
    join pls.customer_bill_address cba on cba.customer_id = c.customer_id
    join pls.load_status ls on ls.load_status_id = l.load_status_id
    where cba.ax_account_number like 'GS%' and l.load_status_id != 0 and trunc(l.created_date) <= '31-May-2021'`);
    const count = parseInt(result.rows[0].count);
    let curr = 0;
    const limit = 10;

    while (curr < count) {
      console.log("User Signup " + { curr, count });
      const qs = `select 'LTL Shipment Booked' ||  l.load_id , ls.load_status_desc as load_status, c.company_name as customer_name, l.pricing_revenue_total as booked_rev, l.pricing_cost_total as booked_costs, l.pricing_revenue_total - l.pricing_cost_total as booked_mar, l.load_size , e.equipments_desc as truck_type from pls.load l
      join pls.customer c on l.customer_id = c.customer_id
      join pls.equipments e on e.equipments_id = l.equipment_id
      join pls.customer_bill_address cba on cba.customer_id = c.customer_id
      join pls.load_status ls on ls.load_status_id = l.load_status_id
      where cba.ax_account_number like 'GS%' and l.load_status_id != 0 and trunc(l.created_date) <= '31-May-2021'`;

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
  };
  try {
    await firstQuery();
  } finally {
    client.release();
  }
  await sequence.flush();
})();
