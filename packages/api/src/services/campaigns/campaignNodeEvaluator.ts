import invariant from "invariant";
import moment from "moment";
import {
  CampaignAudienceRules,
  CampaignEmailScheduling,
  CampaignGraph,
  CampaignNodeKind,
  EdgeKind,
  EntryNodeKinds,
} from "common/campaign";
import AbstractCampaignNode from "common/campaign/nodes/abstractCampaignNode";
import AudienceCampaignNode from "common/campaign/nodes/audienceCampaignNode";
import TriggerCampaignNode from "common/campaign/nodes/triggerCampaignNode";
import { deserialize } from "common/filters";
import App from "src/app";
import { AudienceBuilder } from "src/audience";
import { CampaignStateEnum } from "src/models/campaign.model";
import CampaignNodeState, {
  CampaignNodeStateCreationAttributes,
} from "src/models/campaignNodeState.model";
import { buildCampaignGraph } from "./buildCampaignGraph";
import CampaignNodeEdge from "common/campaign/nodes/campaignNodeEdge";
import logger from "src/utils/logger";
import WaitCampaignNode from "common/campaign/nodes/waitCampaignNode";
import AbstractNodeExecutor from "./nodes/abstractNodeExecutor";
import EmailNodeExecutor from "./nodes/emailNodeExecutor";
import EmailCampaignNode from "common/campaign/nodes/emailCampaignNode";
import WaitNodeExecutor from "./nodes/waitNodeExecutor";
import FilterNodeExecutor from "./nodes/filterNodeExecutor";
import FilterCampaignNode from "common/campaign/nodes/filterCampaignNode";
import ExecutionResult, { ExecutionResultEnum } from "./executionResult";
import ProductUser from "src/models/productUser.model";

type EntryNode = AudienceCampaignNode | TriggerCampaignNode;

/**
 * The CampaignNodeEvaluator manages the running of a `Campaign`, keeping track which `CampaignNodeState`s (which map a `ProductUser`
 * to a specific `CampaignNode`) have been executed, if the `CampaignNodeState` has "timed out"  (meaning that the specific step
 * had not occured within the given time frame), and enqueues the next `CampaignNodeState` depending on whether the current
 * step executed successfully or not.
 *
 */
class CampaignNodeEvaluator {
  #app: App;
  graph: CampaignGraph;
  userId: string;
  campaignId: string;
  nodes: AbstractCampaignNode[];
  edges: CampaignNodeEdge[];
  calledBuild = false;
  constructor(app: App, userId: string, campaignId: string) {
    this.#app = app;
    this.userId = userId;
    this.campaignId = campaignId;
  }
  /**
   * Builds the campaign graph by querying the database for all nodes and edges. This is required to prepare for campaign node evaluation.
   * @returns CampaignNodeEvaluator
   */
  async build() {
    if (this.calledBuild) {
      return this;
    }
    const results = await buildCampaignGraph(
      this.#app.models,
      this.userId,
      this.campaignId
    );
    this.graph = results.graph;
    this.nodes = results.nodes;
    this.edges = results.edges;
    this.calledBuild = true;
    return this;
  }
  /**
   * Make sure to call CampaignNodeEvaluator.build() first.
   * This function gets all Triggers and Audience nodes and evaluates them, beginning the Campaign.
   *
   * @returns Promises for evaluating entry nodes
   */
  async evaluateCampaignEntryNodes() {
    invariant(
      this.calledBuild,
      "Need to call CampaignNodeEvaluator.build() first"
    );
    if (!this.nodes.length) {
      return;
    }
    const entryNodes = this.getEntryNodes();
    return Promise.all(
      entryNodes.map((node) => this.evaluateEntryNode(node as EntryNode))
    );
  }
  /**
   * Evaluates the Audience for the given Audience/Trigger node. It then marks this
   * step as having been completed in the CampaignNodeState model. These nodes will
   * be picked up by the CampaignCronJob for evaluation.
   *
   * @param node EntryNode
   */
  async evaluateEntryNode(node: EntryNode) {
    logger.info(
      "[CampaignNodeEvaluator:evaluateEntryNode] Evaluating " +
        node.kind +
        " " +
        node.getId()
    );
    invariant(
      this.calledBuild,
      "Need to call CampaignNodeEvaluator.build() first"
    );

    // Get product users from executing the associate Audience node
    const productUsers = await this.executeAudience(node);

    // Mark first campaign node as completed for these users, and queue up the next campaign node if it exists
    return this.evaluateEntryNodeForProductUsers(node, productUsers);
  }
  /**
   * Marks the list of product users as matching the EntryNode's filter, and initializes the next
   * step for the campaign.
   *
   * @param node EntryNode Audience or Trigger Node
   * @param productUsers List of product users
   * @returns
   */
  async evaluateEntryNodeForProductUsers(
    node: EntryNode,
    productUsers: ProductUser[]
  ) {
    // mark these ProductUsers as having completed the first step
    const initCampaignNodePromises = productUsers.map((p) =>
      CampaignNodeState.create({
        campaignNodeId: node.id,
        productUserId: p.id,
        state: CampaignStateEnum.COMPLETED,
        runAt: new Date(),
        completedAt: new Date(),
        userId: this.userId,
        didTimeout: false,
        attempts: 1,
        campaignId: this.campaignId,
        timeoutAt: null,
      })
    );
    const campaignNodeStates = await Promise.all(initCampaignNodePromises);

    // get next node states
    const nextNodes = this.getAssociatedDefaultNodes(node);
    if (nextNodes.length === 0) {
      logger.info(
        "[CampaignNodeEvaluator:evaluateEntryNode] No next node found"
      );
      // this campaign path is over
      return;
    }

    // Iterate through all the next default nodes for the campaign and create states for them
    let nodeStatePromises: CampaignNodeStateCreationAttributes[] = [];
    nextNodes.map((nextNode) => {
      logger.info(
        "[CampaignNodeEvaluator:evaluateEntryNode] Found next node: " +
          nextNode.kind +
          " " +
          nextNode.getId()
      );

      // queue up the next nodes to run
      const nextCampaignNodeStates = campaignNodeStates.map((state) => ({
        campaignNodeId: nextNode.id,
        productUserId: state.productUserId,
        state: CampaignStateEnum.PENDING,
        runAt: this.getRunAt(nextNode),
        userId: this.userId,
        campaignId: this.campaignId,
      }));

      nodeStatePromises = nodeStatePromises.concat(nextCampaignNodeStates);
    });
    return await CampaignNodeState.bulkCreate(nodeStatePromises);
  }
  /**
   * Adds the product user to the campaign if it matches a trigger node.
   */
  async evaluateProductUserSaved(productUser: ProductUser) {
    const entryNodes = this.getEntryNodes();
    const processableEntryNodes = entryNodes.filter(
      (campaignNode) =>
        campaignNode.getAudienceRules() === CampaignAudienceRules.New ||
        campaignNode.getAudienceRules() === CampaignAudienceRules.Both
    );
    const promises = processableEntryNodes.map(async (node) => {
      const matchedProductUsers = await this.executeAudienceForProductUser(
        node,
        productUser
      );

      // If the AudienceBuilder returns a match for this node, then the ProductUser
      // continues the campaign
      if (matchedProductUsers.length === 1) {
        // Mark first campaign node as completed for this product user, and queue up the next campaign node if it exists
        return this.evaluateEntryNodeForProductUsers(node, matchedProductUsers);
      }
    });
    return Promise.all(promises);
  }
  /**
   * Evaluates the given node for the campaign.
   *
   * @param node AbstractCampaignNode The current node in the CampaignGraph
   * @param state CampaignNodeState The current instance of the CampaignNode
   * @returns On error: CampaignNodeState with an error state
   * If there is a next node: Returns the next CampaignNodeState
   * If there are no more nodes: Returns null
   */
  async evaluateCampaignNode(
    node: AbstractCampaignNode,
    state: CampaignNodeState
  ) {
    let executionResult: ExecutionResult;
    let executor: AbstractNodeExecutor;

    logger.info(
      "[CampaignNodeEvaluator:evaluateNextNode] Evaluating Node ID: " +
        node.getId()
    );

    // this node has timed out
    if (moment(state.timeoutAt).isBefore(new Date())) {
      // Mark as COMPLETED. Attempts should stay the same since nothing changed.
      await state
        .set({
          state: CampaignStateEnum.COMPLETED,
          didTimeout: true,
        })
        .save();
      return this.evaluateTimedOutCampaignNode(node, state);
    }

    // Mark as RUNNING
    await state
      .set({
        state: CampaignStateEnum.RUNNING,
        attempts: state.attempts + 1,
        runAt: new Date(),
      })
      .save();

    // Get node executor based on type
    executor = this.getExecutor(node);

    try {
      // Execute
      executionResult = await executor.execute(state);
    } catch (error) {
      logger.error(
        `[CampaignNodeEvaluator:evaluateNextNode] Error processing node ${node.getId()} of kind ${
          node.kind
        }:` + error
      );
      return await state
        .set({
          state: CampaignStateEnum.ERROR,
          completedAt: new Date(),
        })
        .save();
    }

    // Node executed successfully
    await state
      .set({
        state: CampaignStateEnum.COMPLETED,
        completedAt: new Date(),
      })
      .save();

    logger.info(
      `[CampaignNodeEvaluator:evaluateNextNode] Execution result: ${executionResult}`
    );

    if (executionResult.result === ExecutionResultEnum.Continue) {
      // Node executed successfully, get next default node and continue campaign
      return this.createNextNodeState(node, state);
    } else {
      if (
        executionResult.result === ExecutionResultEnum.End &&
        node.kind === CampaignNodeKind.Filter
      ) {
        return this.evaluateTimedOutCampaignNode(node, state);
      }
      return null;
    }
  }
  async evaluateTimedOutCampaignNode(
    node: AbstractCampaignNode,
    state: CampaignNodeState
  ) {
    // Node did not execute OR filter failed, get next nodes with edge kind of "Timeout" and continue campaign
    const nextNodes = this.getAssociatedTimeoutNodes(node);

    if (nextNodes.length === 0) {
      // Campaign is finished
      return null;
    }

    const campaignNodeStatePromises = nextNodes.map((nextNode) =>
      CampaignNodeState.create({
        campaignNodeId: nextNode.id,
        productUserId: state.productUserId,
        state: CampaignStateEnum.PENDING,
        runAt: this.getRunAt(nextNode),
        userId: this.userId,
        campaignId: this.campaignId,
      })
    );

    return Promise.all(campaignNodeStatePromises);
  }
  /**
   * Creates the next set of `CampaignNodeState`s required to continue the Campaign.
   *
   * @param node CampaignNode
   * @param state CampaignNodeState The current state of the campaign
   * @returns Promise<CampaignNodeState[]>
   */
  async createNextNodeState(
    node: AbstractCampaignNode,
    state: CampaignNodeState
  ) {
    // Node executed successfully, get next nodes with edge kind of "Default"  and continue campaign
    const nextNodes = this.getAssociatedDefaultNodes(node);

    if (nextNodes.length === 0) {
      // Campaign is finished
      return null;
    }

    const campaignNodeStatePromises = nextNodes.map((nextNode) =>
      CampaignNodeState.create({
        campaignNodeId: nextNode.id,
        productUserId: state.productUserId,
        state: CampaignStateEnum.PENDING,
        runAt: this.getRunAt(nextNode),
        timeoutAt: this.getTimeoutAt(nextNode),
        userId: this.userId,
        campaignId: this.campaignId,
      })
    );

    return Promise.all(campaignNodeStatePromises);
  }
  /**
   * Returns the executor which will perform the action for this node.
   *
   * @param node CampaignNode
   * @returns Executor
   */
  getExecutor(node: AbstractCampaignNode): AbstractNodeExecutor {
    switch (node.kind) {
      case CampaignNodeKind.Email:
        return new EmailNodeExecutor(this.#app, node as EmailCampaignNode);
      case CampaignNodeKind.Filter:
        return new FilterNodeExecutor(this.#app, node as FilterCampaignNode);
      case CampaignNodeKind.Wait:
        return new WaitNodeExecutor(this.#app, node as WaitCampaignNode);
    }
  }
  async executeAudience(entryNode: EntryNode) {
    // get Audience ID from CampaignAudienceNode
    const audience = await this.getAudience(entryNode.getAudienceId());
    // Parse Audience JSON
    const audienceNode = deserialize(JSON.parse(audience.node));
    // Build and execute
    return new AudienceBuilder(audienceNode, this.userId).build().execute();
  }
  async executeAudienceForProductUser(
    entryNode: EntryNode,
    productUser: ProductUser
  ) {
    // get Audience ID from CampaignAudienceNode
    const audience = await this.getAudience(entryNode.getAudienceId());
    // Parse Audience JSON
    const audienceNode = deserialize(JSON.parse(audience.node));
    // Build and execute
    return new AudienceBuilder(audienceNode, this.userId, {
      productUserId: productUser.id,
    })
      .build()
      .execute();
  }
  /**
   * When the next node should be executed. Immediately for all nodes, except for the Wait node.
   *
   * @param campaignNode CampaignNode
   * @returns Date
   */
  getRunAt(campaignNode: AbstractCampaignNode) {
    invariant(
      this.calledBuild,
      "Need to call CampaignNodeEvaluator.build() first"
    );
    if (campaignNode.kind === CampaignNodeKind.Wait) {
      const waitNode = campaignNode as WaitCampaignNode;
      const days = waitNode.getDays();
      const runAt = moment(this.getNow()).add(days, "days");
      return runAt.toDate();
    }
    if (campaignNode.kind === CampaignNodeKind.Email) {
      const emailNode = campaignNode as EmailCampaignNode;
      const scheduling = emailNode.getScheduling();
      if (scheduling === CampaignEmailScheduling.Immediately) {
        return this.getNow();
      }
      if (scheduling === CampaignEmailScheduling.BusinessHours) {
        return this.getNextBusinessHour();
      }
      // TODO
      if (scheduling === CampaignEmailScheduling.SpecificTime) {
        return moment(this.getNow()).hour(11).minute(30).toDate();
      }
    }
    return this.getNow();
  }
  getTimeoutAt(campaignNode: AbstractCampaignNode) {
    invariant(
      this.calledBuild,
      "Need to call CampaignNodeEvaluator.build() first"
    );
    if (campaignNode.kind === CampaignNodeKind.Filter) {
      const filterNode = campaignNode as FilterCampaignNode;
      const days = filterNode.getWaitValue();
      if (days === 0) {
        return null;
      }
      const runAt = moment(this.getNow()).add(days, "days");
      return runAt.toDate();
    }
    return null;
  }
  /**
   *
   * @returns
   */
  getNextBusinessHour() {
    const hour = moment().hour();
    if (hour < 9) {
      return moment(this.getNow()).hour(9).minute(0).toDate();
    }
    if (hour > 17) {
      return moment(this.getNow()).add(1, "day").hour(hour).minute(0).toDate();
    }
    return this.getNow();
  }
  /**
   * The current Date.
   *
   * @returns Date
   */
  getNow() {
    return new Date();
  }
  /**
   * Gets the list of CampaignNodes that can start a Campaign.
   *
   * @returns A list of AudienceNode and/or TriggerNodes.
   */
  getEntryNodes(): EntryNodeKinds[] {
    invariant(
      this.calledBuild,
      "Need to call CampaignNodeEvaluator.build() first"
    );
    return this.nodes.filter(
      (node) =>
        node.kind === CampaignNodeKind.Audience ||
        node.kind === CampaignNodeKind.Trigger
    ) as EntryNodeKinds[];
  }
  /**
   * Returns a list of CampaignNodes that should execute next if the current node is marked as COMPLETED.
   *
   * @param currentNode
   * @returns
   */
  getAssociatedDefaultNodes(
    currentNode: AbstractCampaignNode
  ): AbstractCampaignNode[] {
    return this.getNodesForEdgeKind(currentNode, EdgeKind.Default);
  }
  /**
   * Returns a list of CampaignNodes that should run if the node times out.
   *
   * @param currentNode
   * @returns
   */
  getAssociatedTimeoutNodes(
    currentNode: AbstractCampaignNode
  ): AbstractCampaignNode[] {
    return this.getNodesForEdgeKind(currentNode, EdgeKind.Timeout);
  }
  /**
   * Returns a list of CampaignNodes associated by an Edge of kind `edgeKind`.
   *
   * @param currentNode CampaignNode for the current step of the Campaign
   * @param edgeKind The kind of outgoing edge (Default or Timeout) we'd like to find
   * @returns The list of CampaignNodes connected to `currentNode` with an Edge of kind `edgeKind`
   */
  getNodesForEdgeKind(
    currentNode: AbstractCampaignNode,
    edgeKind: EdgeKind
  ): AbstractCampaignNode[] {
    invariant(
      this.calledBuild,
      "Need to call CampaignNodeEvaluator.build() first"
    );
    // Get edges with type Timeout
    const edges = this.graph.getOutgoingEdges(currentNode);
    const matchingEdges = edges.filter((e) => e.getEdgeKind() === edgeKind);

    // Get nodes associated with our edge(s)
    return matchingEdges.map((edge) => {
      const toId = edge.getToId();
      return this.graph.getNodeById(toId);
    });
  }
  async getAudience(audienceId: string) {
    return this.#app.repositories.audienceRepository.getAudience(
      audienceId,
      this.userId
    );
  }
}

export default CampaignNodeEvaluator;
