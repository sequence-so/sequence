import pg from "pg";
import PostgresService from "../../services/postgres";

export const createPostgresDatabase = async (
  root: any,
  {
    username,
    password,
    port,
    hostname,
    database,
    schema,
    ssl,
  }: {
    username: string;
    password: string;
    port: number;
    hostname: string;
    database: string;
    schema: string;
    ssl: boolean;
  },
  { models, user }: { models: any; user: any }
) => {
  const sslConfig = ssl
    ? {
        require: true,
        rejectUnauthorized: false,
      }
    : null;
  const client = new pg.Client({
    user: username,
    password: password,
    port,
    ssl: sslConfig,
    database,
    host: hostname,
  });
  try {
    console.log("attempting to connect...");
    await client.connect();
    console.log("connected successfully.");
    await client.end();
  } catch (error) {
    console.error(error);
    return new Error(error);
  }

  try {
    const created = await models.AuthDatabase.create({
      type: "postgres",
      userId: user.id,
      username,
      password,
      port,
      hostname,
      database,
      schema,
      ssl,
    });
    return created;
  } catch (error) {
    console.error("error creating auth_database", error);
    return error;
  }
};

export const executeDatabaseQuery = async (
  root: any,
  { query, databaseId }: { query: string; databaseId: string },
  { models, user }: { models: any; user: any }
) => {
  const service = new PostgresService(user);

  let db = await service.getPostgres(databaseId);
  if (!db) {
    return new Error("No database found");
  }

  const result = await service.query(query);

  return { result: JSON.stringify(result) };
};
