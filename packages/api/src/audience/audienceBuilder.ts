import ProductUser from "src/models/productUser.model";
import {
  AbstractNode,
  AttributeFilter,
  Condition,
  EmailFilter,
  EventFilter,
  EventAttribute,
  PageFilter,
  visit,
  NodeVisitor,
} from "common/filters";
import AbstractComparatorNode from "common/filters/comparators/abstractComparatorNode";
import QueryResult from "./queryResult";
import AbstractQueryGenerator, { QueryOptions } from "./abstractQueryGenerator";
import QueryGenerator from "./queryGenerator";
import { FindOptions } from "sequelize/types";
import logger from "src/utils/logger";

/**
 * AudienceBuilder takes your Filters, parses them, and converts them into
 * a tree structure backed by SQL statements. The statements are evaluated
 * according the Conditions provided and merged.
 *
 * Example:
 *
 * const rootNode = Condition.and(...);
 * const builder = new AudienceBuilder(rootNode, userId)
 * const productUsers = builder.build().execute();
 *
 */
export class AudienceBuilder implements NodeVisitor {
  queryResult: QueryResult<ProductUser>;
  queryParents: QueryResult<ProductUser>[] = [];
  queryGenerator: AbstractQueryGenerator;
  root: AbstractNode;
  buildCalled = false;
  userId: string;
  constructor(node: AbstractNode, userId: string, queryOptions?: QueryOptions) {
    this.root = node;
    this.userId = userId;
    this.queryGenerator = new QueryGenerator(this.userId, queryOptions);
  }
  /**
   * Visits all the nodes in your filters and constructs a query from it.
   *
   * @returns AudienceBuilder
   */
  build() {
    this.buildCalled = true;
    this.queryResult = new QueryResult<ProductUser>();
    this.queryParents.push(this.queryResult);
    visit(this.root, this);
    return this;
  }
  /**
   * Executes the query from `build` and returns the list of
   * matching users.
   *
   * @returns ProductUser[]
   */
  async execute() {
    if (!this.buildCalled) {
      throw new Error("AudienceBuilder.build() not called");
    }
    const queryResult = await this.queryResult.children[0].execute();
    return queryResult.result;
  }
  addMatch(query: FindOptions<ProductUser>) {
    logger.info(`[AudienceBuilder:addMatch] Query: ${query}`);
    const promise = ProductUser.findAll(query);
    const match = new QueryResult(promise);
    this.queryResult.children.push(match);
  }
  onBeginCondition(node: Condition) {
    const nextQueryResult = new QueryResult<ProductUser>();
    nextQueryResult.operator = node.isAnd() ? "and" : "or";
    this.queryParents.push(this.queryResult);
    this.queryResult.children.push(nextQueryResult);
    this.queryResult = nextQueryResult;
  }
  onEndCondition(node: Condition) {
    this.queryResult = this.queryParents.pop();
  }
  onEventNode(node?: EventFilter) {
    const findQuery = this.queryGenerator.onEventNode(node);
    this.addMatch(findQuery);
  }
  onEventAttributeNode(node: EventAttribute) {
    const findQuery = this.queryGenerator.onEventAttributeNode(node);
    this.addMatch(findQuery);
  }
  onUserAttributeNode(node: AttributeFilter) {
    const findQuery = this.queryGenerator.onUserAttributeNode(node);
    this.addMatch(findQuery);
  }
  onEndOperand() {}
  onEmailNode(node: EmailFilter) {}
  onPageFilterNode(node: PageFilter) {}
  onComparatorNode(node: AbstractComparatorNode) {}
}
