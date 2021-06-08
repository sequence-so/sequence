import Event from "src/models/event";
import ProductUser, { VALID_KEYS } from "src/models/product_user";
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
import { comparatorToQuery } from "./comparatorToQuery";
import AbstractComparatorNode from "common/filters/comparators/abstractComparatorNode";
import QueryResult from "./queryResult";

/**
 * Execute your filter nodes through this call.
 *
 */
export class AudienceBuilder implements NodeVisitor {
  queryResult: QueryResult<ProductUser>;
  queryParents: QueryResult<ProductUser>[] = [];
  root: AbstractNode;
  buildCalled = false;
  userId: string;
  constructor(node: AbstractNode, userId: string) {
    this.root = node;
    this.userId = userId;
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
    let queryResult = await this.queryResult.children[0].execute();
    return queryResult.result;
  }
  addMatch(promise: Promise<ProductUser[]>) {
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
  async onEventNode(node?: EventFilter) {
    let matching: Promise<ProductUser[]>;
    if (typeof node.performed !== "undefined") {
      if (node.performed) {
        matching = ProductUser.findAll({
          where: {
            //@ts-ignore
            "$events.name$": comparatorToQuery(
              node.comparator,
              node.expected,
              node
            ),
            "$events.userId$": this.userId,
            userId: this.userId,
          },
          include: [
            {
              model: Event,
              as: "events",
              attributes: [],
            },
          ],
          group: "ProductUser.id",
        });
      } else {
        matching = ProductUser.findAll({
          where: {
            //@ts-ignore
            "$events.id$": null,
            userId: this.userId,
          },
          include: [
            {
              model: Event,
              as: "events",
              attributes: ["id"],
              required: false,
              //@ts-ignore
              where: {
                name: comparatorToQuery(node.comparator, node.expected, node),
                userId: this.userId,
              },
            },
          ],
        });
      }
    }
    this.addMatch(matching);
  }
  onEventAttributeNode(node: EventAttribute) {
    this.addMatch(
      ProductUser.findAll({
        where: {
          userId: this.userId,
        },
        include: [
          {
            model: Event,
            as: "events",
            attributes: [],
            required: true,
            where: {
              [`properties.${node.attribute}`]: comparatorToQuery(
                node.comparator,
                node.expected,
                node
              ),
            },
          },
        ],
        group: "ProductUser.id",
      })
    );
  }
  onUserAttributeNode(node: AttributeFilter) {
    const isValid = (VALID_KEYS as any)[node.attribute];
    if (isValid) {
      this.addMatch(
        ProductUser.findAll({
          where: {
            [node.attribute]: comparatorToQuery(
              node.comparator,
              node.expected,
              node
            ),
            userId: this.userId,
          },
        })
      );
    } else {
      this.addMatch(
        ProductUser.findAll({
          where: {
            [`traits.${node.attribute}`]: comparatorToQuery(
              node.comparator,
              node.expected,
              node
            ),
            userId: this.userId,
          },
        })
      );
    }
  }
  onEndOperand() {}
  onEmailNode(node: EmailFilter) {}
  onPageFilterNode(node: PageFilter) {}
  onComparatorNode(node: AbstractComparatorNode) {}
}
