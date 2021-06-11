import { AttributeFilter, PageFilter } from "common/filters";
import { EmailFilterNode, EventAttributeNode } from "common/filters/nodes";
import EventNode from "common/filters/nodes/eventFilterNode";
import { FindOptions } from "sequelize/types";
import Event from "src/models/event.model";
import {
  ProductUserAttributes,
  VALID_KEYS,
} from "src/models/productUser.model";
import AbstractQueryGenerator, { QueryOptions } from "./abstractQueryGenerator";
import { comparatorToQuery } from "./comparatorToQuery";

class QueryGenerator extends AbstractQueryGenerator {
  userId: string;
  options?: QueryOptions;
  constructor(userId: string, options?: QueryOptions) {
    super();
    this.userId = userId;
    this.options = options;
  }
  onEventNode(
    node: EventNode,
    options?: QueryOptions
  ): FindOptions<ProductUserAttributes> {
    const applyOptions =
      this.options || options ? { ...this.options, ...options } : undefined;
    if (typeof node.performed === "undefined") {
      return {};
    }
    if (node.performed) {
      const where = {
        //@ts-ignore
        "$events.name$": comparatorToQuery(
          node.comparator,
          node.expected,
          node
        ),
        "$events.userId$": this.userId,
        userId: this.userId,
      };

      if (applyOptions) {
        // @ts-ignore
        where["id"] = applyOptions.productUserId;
      }

      return {
        where,
        include: [
          {
            model: Event,
            as: "events",
            attributes: [],
          },
        ],
        group: "ProductUser.id",
      };
    }
    const where = {
      //@ts-ignore
      "$events.id$": null,
      userId: this.userId,
    };
    if (applyOptions) {
      // @ts-ignore
      where["id"] = applyOptions.productUserId;
    }
    return {
      where,
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
    };
  }
  onEventAttributeNode(
    node: EventAttributeNode,
    options?: QueryOptions
  ): FindOptions<ProductUserAttributes> {
    const applyOptions =
      this.options || options ? { ...this.options, ...options } : undefined;
    const where = {
      userId: this.userId,
    };

    if (applyOptions) {
      // @ts-ignore
      where["id"] = applyOptions.productUserId;
    }

    return {
      where: where,
      include: [
        {
          model: Event,
          //@ts-ignore
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
    };
  }
  onUserAttributeNode(
    node: AttributeFilter,
    options?: QueryOptions
  ): FindOptions<ProductUserAttributes> {
    const applyOptions =
      this.options || options ? { ...this.options, ...options } : undefined;
    const isValid = (VALID_KEYS as any)[node.attribute];
    if (isValid) {
      const where = {
        [node.attribute]: comparatorToQuery(
          node.comparator,
          node.expected,
          node
        ),
        userId: this.userId,
      };
      if (applyOptions) {
        where.id = applyOptions.productUserId;
      }
      return {
        where,
      };
    } else {
      const where = {
        [`traits.${node.attribute}`]: comparatorToQuery(
          node.comparator,
          node.expected,
          node
        ),
        userId: this.userId,
      };
      if (applyOptions) {
        where.id = applyOptions.productUserId;
      }
      return {
        where,
      };
    }
  }
  onEmailNode(
    node: EmailFilterNode,
    options?: QueryOptions
  ): FindOptions<ProductUserAttributes> {
    return {};
  }
  onPageFilterNode(
    node: PageFilter,
    options?: QueryOptions
  ): FindOptions<ProductUserAttributes> {
    return {};
  }
}

export default QueryGenerator;
