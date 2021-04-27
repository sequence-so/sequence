import { GraphQLScalarType, Kind } from "graphql";
import fetch from "node-fetch";
import FormData from "form-data";
import crypto from "crypto";
import { promisify } from "util";
import pg from "pg";
import PostgresService from "../services/postgres";
const randomBytes = promisify(crypto.randomBytes);
import Cryptr from "cryptr";
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

const resolvers = {
  Query: {
    async getUser(
      root: any,
      _: any,
      { models, user }: { models: any; user: any }
    ) {
      return user;
    },
    async getIntercom(
      root: any,
      _: any,
      { models, user }: { models: any; user: any }
    ) {
      const intercom = await models.AuthIntercom.findOne({
        where: {
          userId: user.id,
        },
      });
      if (intercom) {
        return {
          id: intercom.id,
          isEnabled: true,
          createdAt: intercom.createdAt,
          updatedAt: intercom.updatedAt,
        };
      }
      return {
        id: null,
        isEnabled: false,
        createdAt: null,
        updatedAt: null,
      };
    },
    async getIntegrations(
      root: any,
      _: any,
      { models, user }: { models: any; user: any }
    ) {
      const intercom = await models.AuthIntercom.findOne({
        where: {
          userId: user.id,
        },
      });
      const segmentWebhook = await models.SegmentWebhook.findOne({
        where: {
          userId: user.id,
        },
      });
      const segmentExecution = await models.WebhookExecution.findOne({
        where: {
          userId: user.id,
        },
        order: [["createdAt", "DESC"]],
      });

      const postgres = await models.AuthDatabase.findOne({
        where: {
          userId: user.id,
        },
      });
      let integrations: any = {
        intercom: intercom ? true : false,
        segment: segmentExecution ? true : false,
        postgres: postgres ? true : false,
      };

      return integrations;
    },
    async getSegmentWebhook(
      root: any,
      _: any,
      { models, user }: { models: any; user: any }
    ) {
      const webhook = await models.SegmentWebhook.findOne({
        where: {
          userId: user.id,
        },
      });
      if (!webhook) {
        return null;
      }

      const execution = await models.WebhookExecution.findOne({
        where: {
          userId: user.id,
        },
        order: [["createdAt", "DESC"]],
      });

      return {
        id: webhook.id,
        token: webhook.token,
        receivedDataAt: execution ? execution.createdAt : null,
        createdAt: webhook.createdAt,
        updatedAt: webhook.updatedAt,
      };
    },
    async getDatabases(
      root: any,
      _: any,
      { models, user }: { models: any; user: any }
    ) {
      const databases = await models.AuthDatabase.findAll({
        where: {
          userId: user.id,
        },
      });
      const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);
      databases.map((database) => {
        database.hostname = cryptr.decrypt(database.hostname);
      });
      return databases;
    },
    async getPostgresSchema(
      root: any,
      { databaseId }: { databaseId: string },
      { models, user }: { models: any; user: any }
    ) {
      const service = new PostgresService(user);

      let db = await service.getPostgres(databaseId);
      if (!db) {
        return new Error("No database found");
      }

      const result = await service.query("\\dt");

      return { result: JSON.stringify(result) };
    },
  },
  Mutation: {
    async saveIntercomCode(
      root: any,
      { code }: { code: string },
      { models, user }: { models: any; user: any }
    ) {
      const intercom = await models.AuthIntercom.create({
        userId: user.id,
        code,
      });

      const formData = new FormData();
      formData.append("code", code);
      formData.append("client_id", process.env.INTERCOM_CLIENT_ID);
      formData.append("client_secret", process.env.INTERCOM_CLIENT_SECRET);
      const fetchResult = await fetch(
        "https://api.intercom.io/auth/eagle/token",
        {
          method: "POST",
          body: formData,
        }
      );
      const json = (await fetchResult.json()) as { token: string };

      console.log(json);
      intercom.token = json.token;
      intercom.save();

      return {
        id: intercom.id,
        isEnabled: true,
        createdAt: intercom.createdAt,
        updatedAt: intercom.updatedAt,
      };
    },
    async createPostgresDatabase(
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
    ) {
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
    },
    async createSegmentWebhook(
      root: any,
      _: any,
      { models, user }: { models: any; user: any }
    ) {
      let webhook = await models.SegmentWebhook.findOne({
        userId: user.id,
      });

      if (webhook) {
        return webhook;
      }

      const token = (await randomBytes(18)).toString("hex");

      webhook = await models.SegmentWebhook.create({
        token: token,
        userId: user.id,
        receivedDataAt: null,
      });

      return webhook;
    },
    async executeDatabaseQuery(
      root: any,
      { query, databaseId }: { query: string; databaseId: string },
      { models, user }: { models: any; user: any }
    ) {
      const service = new PostgresService(user);

      let db = await service.getPostgres(databaseId);
      if (!db) {
        return new Error("No database found");
      }

      const result = await service.query(query);

      return { result: JSON.stringify(result) };
    },
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.toISOString(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};

export default resolvers;
