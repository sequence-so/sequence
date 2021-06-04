import PostgresService from "../../services/postgres";

export const getPostgresSchema = async (
  root: any,
  { databaseId }: { databaseId: string },
  { models, user }: { models: any; user: any }
) => {
  const service = new PostgresService(user);

  let db = await service.getPostgres(databaseId);
  if (!db) {
    return new Error("No database found");
  }

  const result = await service.query("\\dt");

  return { result: JSON.stringify(result) };
};
