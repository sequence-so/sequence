import Cryptr from "cryptr";
import pg, { Client } from "pg";
import User from "../models/user";
import AuthDatabase from "../models/auth_database";
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

class PostgresService {
  user: User;
  db: AuthDatabase;
  client: Client;
  constructor(user: User) {
    this.user = user;
    this.db = null;
  }
  async getPostgres() {
    const db = await AuthDatabase.findOne({
      where: {
        userId: this.user.id,
        type: "postgres",
      },
    });

    this.db = db;

    return db;
  }
  async connect() {
    let db;
    if (this.db) {
      db = this.db;
    } else {
      db = await AuthDatabase.findOne({
        where: {
          userId: this.user.id,
          type: "postgres",
        },
      });

      if (!db) {
        return null;
      }
    }

    const username = cryptr.decrypt(db.username);
    const password = cryptr.decrypt(db.password);
    const hostname = cryptr.decrypt(db.hostname);

    const client = new pg.Client({
      user: username,
      password: password,
      port: db.port,
      ssl: db.ssl,
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

    this.client = client;

    return client;
  }
  async query(query: string) {
    let db;
    if (this.db) {
      db = this.db;
    } else {
      db = await AuthDatabase.findOne({
        where: {
          userId: this.user.id,
          type: "postgres",
        },
      });

      if (!db) {
        return null;
      }
    }

    const username = cryptr.decrypt(db.username);
    const password = cryptr.decrypt(db.password);
    const hostname = cryptr.decrypt(db.hostname);

    const client = new pg.Client({
      user: username,
      password: password,
      port: db.port,
      ssl: db.ssl,
      host: hostname,
      database: db.database,
    });

    try {
      console.log("attempting to connect...");
      await client.connect();
      console.log("connected successfully.");
    } catch (error) {
      console.error(error);
      return new Error(error);
    }

    return client.query(query);
  }
}

export default PostgresService;
