import format from "pg-format";

class Query {
  name: string;
  query: string;
  parse({
    limit,
    offset,
    args,
  }: {
    limit: number;
    offset: number;
    args?: any[];
  }): string {
    return format(this.query, ...args) + ` LIMIT ${limit} OFFSET ${offset}`;
  }
}

export default Query;
