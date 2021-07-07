import App from "src/app";
import ProductUser from "src/models/productUser.model";
import CampaignNodeEvaluator from "src/services/campaigns/campaignNodeEvaluator";

/**
 * When a ProductUser is saved, we need to evaluate if it should be added to a campaign.
 * 1. Get list of campaigns this ProductUser is in (for deduping)
 * 2. Get all campaigns for the given User
 * 3. Remove campaigns that the ProductUser is already a part of
 * 4. For the remaining set of Campaigns, get the CampaignNodeEvaluator and build it
 * 5. Once built, run `CampaignNodeEvaluator.evaluateProductUserSaved` which checks if the
 *  ProductUser should be added to any of these campaigns and performs the insertions
 *
 * @param productUser ProductUser
 * @returns
 */
export const productUserSaved = async (productUser: ProductUser) => {
  // @ts-ignore
  const app = productUser.sequelize.app as App;
  const models = app.models;
  const allCampaigns = await models.Campaign.findAll({
    where: {
      userId: productUser.userId,
    },
  });
  // exit early if this user has no campaigns
  if (allCampaigns.length === 0) {
    return;
  }
  const existingCampaigns = await models.CampaignNodeState.findAll({
    where: {
      productUserId: productUser.id,
    },
  });
  const campaignIds = allCampaigns.map((c) => c.id);

  existingCampaigns.forEach((campaignNodeState) => {
    const idx = campaignIds.indexOf(campaignNodeState.campaignId);
    if (idx !== -1) {
      // we're already in this campaign, remove it from processing
      allCampaigns.splice(idx, 1);
    }
  });

  // now we have the list of campaigns that we're not in. get the campaign evaluators
  const list = allCampaigns.map((campaign) => ({
    campaign,
    evaluator: new CampaignNodeEvaluator(app, productUser.userId, campaign.id),
  }));

  // build evaluators
  const campaignNodeEvaluatorPromises = list.map(async (payload) => {
    return payload.evaluator.build();
  });

  await Promise.all(campaignNodeEvaluatorPromises);

  // now we can get the trigger nodes and see if our product user update should do anything
  const productUserSavedPromise = list.map(async (payload) =>
    payload.evaluator.evaluateProductUserSaved(productUser)
  );

  return Promise.all(productUserSavedPromise);
};
