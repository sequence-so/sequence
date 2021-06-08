import { GraphQLContextType } from "..";
import Campaign, { CampaignCreationAttributes } from "src/models/campaigns";
import Sendgrid from "@sendgrid/mail";
import mustache from "mustache";
import { Condition } from "common/filters";
import { AudienceBuilder } from "src/audience";
import ProductUser from "src/models/product_user";
import Audience from "src/models/audience";
import Email from "src/models/emails";
Sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

type CreateCampaignInputArgs = Omit<CampaignCreationAttributes, "userId">;

type UpdateCampaignInputArgs = CreateCampaignInputArgs & {
  id: string;
};

export const createCampaign = async (
  root: any,
  { name, audienceId, emailId, sentAt }: CreateCampaignInputArgs,
  { models, user }: GraphQLContextType
) => {
  const campaign: Campaign = await models.Campaign.create({
    userId: user.id,
    name,
    audienceId,
    emailId,
    sentAt,
  });
  executeCampaign(campaign, { models, user });
  return campaign;
};

export const updateCampaign = async (
  root: any,
  args: UpdateCampaignInputArgs,
  { models, user }: GraphQLContextType
) => {
  let id = args.id;
  let campaign: Campaign;

  campaign = await models.Campaign.findOne({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!campaign) {
    throw new Error("No campaign found");
  }

  const updateArgs = { ...args };
  delete updateArgs.id;
  campaign = await campaign.update(updateArgs);
  return campaign;
};

const executeCampaign = async (campaign: Campaign, { models }: any) => {
  let parsedAudience: object;
  let rootNode: Condition;
  let builder: AudienceBuilder;
  let productUsers: ProductUser[];
  let audienceModel: Audience;
  let emailModel: Email;
  let audience: Audience;

  audience = await models.Audience.findOne({
    where: {
      id: campaign.audienceId,
    },
    include: ["productUsers"],
  });
  if (!audience) {
    throw new Error("No audience found");
  }
  const audienceProductUsers = await models.AudienceProductUser.findAll({
    where: {
      audienceId: campaign.audienceId,
    },
    include: ["productUser"],
  });

  productUsers = audienceProductUsers.map((audienceProductUser: any) => {
    return (audienceProductUser as any).productUser as ProductUser;
  });

  emailModel = await models.Email.findOne({
    where: {
      userId: audience.userId,
      id: campaign.emailId,
    },
  });

  try {
    const sendEmailPromises = productUsers
      .map((person) => {
        const renderedHtml = mustache.render(emailModel.bodyHtml, person);
        const renderedSubject = mustache.render(emailModel.subject, person);
        console.log({ renderedHtml, renderedSubject });
        return {
          from: "helson@sequence.so",
          html: renderedHtml,
          subject: renderedSubject,
          to: person.email,
        };
      })
      .map((payload) => Sendgrid.send(payload));
    await Promise.all(sendEmailPromises);
    await campaign.update({
      sentAt: new Date(),
    });
  } catch (error) {
    console.error(error);
  }
};
