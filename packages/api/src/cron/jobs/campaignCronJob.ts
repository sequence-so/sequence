import NodeCache from "node-cache";
import invariant from "invariant";
import CampaignNodeState from "src/models/campaignNodeState.model";
import CampaignNodeEvaluator from "src/services/campaigns/campaignNodeEvaluator";
import logger from "src/utils/logger";
import CronJob from "../cronJob";

const CACHE_TTL = 300;

/**
 * Cron job for running the next node in a Campaign.
 */
class CampaignCronJob extends CronJob {
  name = "Campaign Cron Job";
  /**
   * Cache the CampaignNodeEvaluator so we don't need to rebuild the
   * CampaignGraph with this execution cycle if multiple nodes require
   * execution from the same Campaign.
   */
  evaluatorCache: NodeCache;
  constructor() {
    super();
    this.evaluatorCache = new NodeCache({
      useClones: false,
    });
  }
  /**
   * Performs this every minute. Processes the campaignNodeStates
   */
  async tick() {
    const repository = this.app.getRepositories().campaignNodeRepository;
    await this.processNodeList(await repository.getNextCampaignNodeStates());
    await this.processNodeList(
      await repository.getNextTimedOutCampaignNodeStates()
    );
  }
  async processNodeList(nodes: CampaignNodeState[]) {
    this.populateCampaignNodeEvaluators(nodes);
    await this.buildCampaignNodeEvaluators();
    const promises = nodes.map((state) => {
      const campaignId = state.campaignId;
      const evaluator =
        this.evaluatorCache.get<CampaignNodeEvaluator>(campaignId);
      const campaignNode = evaluator.graph.getNodeById(state.campaignNodeId);
      return evaluator.evaluateCampaignNode(campaignNode, state);
    });
    return Promise.all(promises);
  }
  /**
   * Instantiate the CampaignNodeEvalutors if they don't already exist and cache them.
   *
   * @param nodes
   */
  populateCampaignNodeEvaluators(nodes: CampaignNodeState[]) {
    nodes.forEach((state) => {
      const campaignId = state.campaignId;
      const userId = state.userId;
      if (this.evaluatorCache.get(campaignId)) {
        return;
      }
      this.evaluatorCache.set(
        campaignId,
        new CampaignNodeEvaluator(this.app, userId, campaignId),
        CACHE_TTL
      );
    });
  }
  /**
   * Each Campaign will have its own CampaignNodeEvaluator. We cache them
   * so we don't need to rebuild them on every tick. This can definitely
   * be improved!
   *
   * @returns
   */
  async buildCampaignNodeEvaluators() {
    const promises = this.evaluatorCache
      .keys()
      .map((k) => this.evaluatorCache.get(k))
      .map((evaluator: CampaignNodeEvaluator) => evaluator.build());
    return Promise.all(promises);
  }
}

export default CampaignCronJob;
