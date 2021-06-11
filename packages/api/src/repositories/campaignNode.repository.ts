import { Op } from "sequelize";
import App from "src/app";
import Campaign, { CampaignStateEnum } from "src/models/campaign.model";
import AbstractRepository from "./abstractRepository";

const RUNNING_CAMPAIGN = {
  model: Campaign,
  as: "campaign",
  where: {
    state: CampaignStateEnum.RUNNING,
    isDraft: false,
  },
};

class CampaignNodeRepository extends AbstractRepository {
  constructor(app: App) {
    super(app);
  }
  /**
   * Query should look for all campaign_nodes that are in an unporcessed state who's next
   * execution time is at or before the current time
   */
  getNextCampaignNodeStates() {
    return this.models.CampaignNodeState.findAll({
      where: {
        state: CampaignStateEnum.PENDING,
        // Normal node execution, run when runAt becomes true. Count ensures we only execute on
        // first execution. Subsequent runs will be trigger through our Event API
        [Op.and]: {
          runAt: { [Op.lt]: new Date() },
          attempts: 0,
        },
      },
      include: [RUNNING_CAMPAIGN],
    });
  }
  getNextTimedOutCampaignNodeStates() {
    return this.models.CampaignNodeState.findAll({
      where: {
        state: CampaignStateEnum.PENDING,
        // Only run timeout nodes once they've been attempted at least once
        attempts: { [Op.gte]: 1 },
        timeoutAt: { [Op.lt]: new Date() },
      },
      include: [RUNNING_CAMPAIGN],
    });
  }
  /**
   * Queries campaign_nodes who's status is active but the job has not completed after 10 minutes
   * of initial execution time.
   */
  getNextCampaignNodesJobsFailed() {}
}

export default CampaignNodeRepository;
