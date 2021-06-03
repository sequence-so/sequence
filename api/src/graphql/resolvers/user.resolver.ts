import { GraphQLContextType } from "../index";
import cryptr from "../../utils/crypto";

export const getUser = async (
  root: any,
  _: any,
  { user }: GraphQLContextType
) => {
  return user;
};

export const getIntegrations = async (
  root: any,
  _: any,
  { models, user }: GraphQLContextType
) => {
  const intercom = await models.AuthIntercom.findOne({
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
  const discord = await models.AuthDiscord.findOne({
    where: {
      userId: user.id,
    },
  });
  const node = await models.SequenceWebhook.findOne({
    where: {
      userId: user.id,
    },
  });
  let integrations: any = {
    intercom: intercom ? true : false,
    segment: segmentExecution ? true : false,
    postgres: postgres ? true : false,
    discord: discord ? true : false,
    node: node ? true : false,
  };

  return integrations;
};

export const getDatabases = async (
  root: any,
  _: any,
  { models, user }: GraphQLContextType
) => {
  const databases = await models.AuthDatabase.findAll({
    where: {
      userId: user.id,
    },
  });
  databases.map((database: any) => {
    database.hostname = cryptr.decrypt(database.hostname);
  });
  return databases;
};
