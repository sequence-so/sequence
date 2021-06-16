import { GraphQLContextType } from "..";
import Blast, { BlastCreationAttributes } from "src/models/blast.model";
import Sendgrid from "@sendgrid/mail";
import mustache from "mustache";
import { Condition } from "common/filters";
import { AudienceBuilder } from "src/audience";
import ProductUser from "src/models/productUser.model";
import Audience from "src/models/audience.model";
import Email from "src/models/email.model";
Sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

type CreateBlastInputArgs = Omit<BlastCreationAttributes, "userId">;

type UpdateBlastInputArgs = CreateBlastInputArgs & {
  id: string;
};

export const createBlast = async (
  root: any,
  { name, audienceId, emailId, sentAt }: CreateBlastInputArgs,
  { models, user }: GraphQLContextType
) => {
  const blast = await models.Blast.create({
    userId: user.id,
    name,
    audienceId,
    emailId,
    sentAt,
  });
  executeBlast(blast, { models, user });
  return blast;
};

export const updateBlast = async (
  root: any,
  args: UpdateBlastInputArgs,
  { models, user }: GraphQLContextType
) => {
  const id = args.id;
  let blast: Blast;

  blast = await models.Blast.findOne({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!blast) {
    throw new Error("No blast found");
  }

  const updateArgs = { ...args };
  delete updateArgs.id;
  blast = await blast.update(updateArgs);
  return blast;
};

const executeBlast = async (blast: Blast, { models }: any) => {
  let parsedAudience: object;
  let rootNode: Condition;
  let builder: AudienceBuilder;
  let productUsers: ProductUser[];
  let audienceModel: Audience;
  let emailModel: Email;
  let audience: Audience;

  audience = await models.Audience.findOne({
    where: {
      id: blast.audienceId,
    },
    include: ["productUsers"],
  });
  if (!audience) {
    throw new Error("No audience found");
  }
  const audienceProductUsers = await models.AudienceProductUser.findAll({
    where: {
      audienceId: blast.audienceId,
    },
    include: ["productUser"],
  });

  productUsers = audienceProductUsers.map((audienceProductUser: any) => {
    return (audienceProductUser as any).productUser as ProductUser;
  });

  emailModel = await models.Email.findOne({
    where: {
      userId: audience.userId,
      id: blast.emailId,
    },
  });

  try {
    const sendEmailPromises = productUsers
      .map((person) => {
        const renderedHtml = mustache.render(emailModel.bodyHtml, person);
        const renderedSubject = mustache.render(emailModel.subject, person);
        // console.log({ renderedHtml, renderedSubject });
        return {
          from: "helson@sequence.so",
          html: renderedHtml,
          subject: renderedSubject,
          to: person.email,
        };
      })
      .map((payload) => Sendgrid.send(payload));
    await Promise.all(sendEmailPromises);
    await blast.update({
      sentAt: new Date(),
    });
  } catch (error) {
    console.error(error);
  }
};
