import Cryptr from "cryptr";
import pg from "pg";
import User from "../models/user";
import AuthDatabase from "../models/auth_database";
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

class PostgresService {
  user: User;
  constructor(user: User) {
    this.user = user;
  }
  async connect() {
    const db = await AuthDatabase.findOne({
      where: {
        userId: this.user.id,
        type: "postgres",
      },
    });

    if (!db) {
      return null;
    }

    const username = cryptr.decrypt(db.username);
    const password = cryptr.decrypt(db.password);
    const hostname = cryptr.decrypt(db.hostname);

    console.log({ username, password, hostname });
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
  }
}

export default PostgresService;
