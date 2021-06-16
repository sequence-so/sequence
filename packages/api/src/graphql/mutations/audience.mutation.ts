import {
  Condition,
  deserialize,
  NodeParseError,
  parse,
  SerializedConditionNode,
} from "common/filters";
import { AudienceBuilder } from "src/audience";
import Audience from "src/models/audience.model";
import AudienceProductUser from "../../models/audienceProductUser.model";
import { GraphQLContextType } from "..";
import SequenceError from "src/error/sequenceError";

export const executeAudience = async (
  root: any,
  { audience, page, limit }: { page: number; limit: number; audience: string },
  { models, user }: GraphQLContextType
) => {
  page = page || 0;
  limit = limit || 10;

  try {
    const parsed = JSON.parse(audience);
    const node = deserialize(parsed as SerializedConditionNode);
    const builder = new AudienceBuilder(node, user.id);
    const productUsers = await builder.build().execute();

    return {
      nodes: productUsers,
      page: 0,
      rows: productUsers.length,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const createAudience = async (
  _: any,
  args: { name: string; node: string; localTo: string },
  { models, user }: GraphQLContextType
) => {
  let audienceModel: Audience;
  let parsed: object;
  let deserializedNode: Condition;
  const parseErrors: NodeParseError[] = [];
  let builder: AudienceBuilder;

  try {
    parsed = JSON.parse(args.node);
  } catch (error) {
    throw new Error("Error parsing JSON");
  }

  deserializedNode = deserialize(parsed as SerializedConditionNode);
  parse(deserializedNode, parseErrors);

  if (parseErrors.length) {
    const apiError = new SequenceError("Error parsing query node", 500);
    apiError.errors = parseErrors;
    throw apiError;
  }

  audienceModel = await models.Audience.create({
    name: args.name,
    node: args.node,
    localTo: args.localTo,
    userId: user.id,
  });

  if (!args.localTo) {
    builder = new AudienceBuilder(deserializedNode, user.id);
    const productUsers = await builder.build().execute();
    const bulkData = productUsers
      .map((elem) => elem.id)
      .map((id) => ({ productUserId: id, audienceId: audienceModel.id }));
    await AudienceProductUser.bulkCreate(bulkData);
    await audienceModel.update({
      count: productUsers.length,
      executedAt: new Date(),
    });
  }

  return audienceModel;
};

export const updateAudience = async (
  root: any,
  args: { id: string; name: string; node: string; localTo: string },
  { models, user }: GraphQLContextType
) => {
  const id = args.id;
  let audience: Audience;

  audience = await models.Audience.findOne({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!audience) {
    throw new SequenceError("No audience found", 422);
  }

  const updateArgs = { ...args };
  delete updateArgs.id;
  return await audience.update(updateArgs);
};
