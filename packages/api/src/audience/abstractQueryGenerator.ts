import { AttributeFilter, PageFilter } from "common/filters";
import { EmailFilterNode, EventAttributeNode } from "common/filters/nodes";
import EventNode from "common/filters/nodes/eventFilterNode";
import { FindOptions } from "sequelize/types";
import { ProductUserAttributes } from "src/models/productUser.model";

export interface QueryOptions {
  productUserId?: string;
}

/**
 * The interface between the AudienceBuilder and an ORM query.
 */
abstract class AbstractQueryGenerator {
  abstract onEventNode(
    node: EventNode,
    options?: QueryOptions
  ): FindOptions<ProductUserAttributes>;
  abstract onEventAttributeNode(
    node: EventAttributeNode,
    options?: QueryOptions
  ): FindOptions<ProductUserAttributes>;
  abstract onUserAttributeNode(
    node: AttributeFilter,
    options?: QueryOptions
  ): FindOptions<ProductUserAttributes>;
  abstract onEmailNode(
    node: EmailFilterNode,
    options?: QueryOptions
  ): FindOptions<ProductUserAttributes>;
  abstract onPageFilterNode(
    node: PageFilter,
    options?: QueryOptions
  ): FindOptions<ProductUserAttributes>;
}

export default AbstractQueryGenerator;
