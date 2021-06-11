import { expect } from "chai";
import {
  ComparatorKind,
  Condition,
  ConditionNodeKind,
  deserialize,
  EventFilter,
  FilterKind,
  NodeKind,
  serialize,
  serializeConditionNode,
  SerializedAttributeFilter,
  SerializedComparatorNode,
  SerializedEventFilter,
  serializeEventFilterNode,
} from "common/filters";
import { AttributeFilterNode, EventFilterNode } from "common/filters/nodes";
import { Operators } from "common/filters/operators";

describe("deserialize", () => {
  describe("conditions", () => {
    it("should deserialize Condition.and", () => {
      expect(
        deserialize({
          id: "abc",
          conditionKind: ConditionNodeKind.AND,
          operator: Operators.and,
          children: [],
          nodeKind: NodeKind.Condition,
        })
      ).to.deep.eq(Condition.and().setId("abc"));
    });
    it("should deserialize Condition.or", () => {
      expect(
        deserialize({
          id: "abc",
          conditionKind: ConditionNodeKind.OR,
          operator: Operators.or,
          children: [],
          nodeKind: NodeKind.Condition,
        })
      ).to.deep.eq(Condition.or().setId("abc"));
    });
  });
  describe("filters", () => {
    it("should deserialize EventFilter", () => {
      expect(
        deserialize({
          id: "abc",
          conditionKind: ConditionNodeKind.AND,
          operator: Operators.and,
          children: [
            {
              id: "def",
              nodeKind: NodeKind.Filter,
              filterKind: FilterKind.Event,
              attribute: "name",
              expected: "Logout",
              performed: true,
              comparator: {
                id: "ghi",
                comparatorKind: ComparatorKind.String,
                operator: Operators.eq,
                nodeKind: NodeKind.Comparator,
              },
            } as SerializedEventFilter,
          ],
          nodeKind: NodeKind.Condition,
        })
      ).to.deep.eq(
        Condition.and(
          EventFilterNode.new("Logout")
            .hasBeenPerformed()
            .setId("def")
            .setComparatorId("ghi")
        ).setId("abc")
      );
      expect(
        deserialize({
          id: "abc",
          conditionKind: ConditionNodeKind.AND,
          operator: Operators.and,
          children: [
            {
              id: "def",
              nodeKind: NodeKind.Filter,
              filterKind: FilterKind.Event,
              attribute: "name",
              expected: "Logout",
              performed: false,
              comparator: {
                id: "ghi",
                comparatorKind: ComparatorKind.String,
                operator: Operators.eq,
                nodeKind: NodeKind.Comparator,
              },
            } as SerializedEventFilter,
          ],
          nodeKind: NodeKind.Condition,
        })
      ).to.deep.eq(
        Condition.and(
          EventFilterNode.new("Logout")
            .hasNotBeenPerformed()
            .setId("def")
            .setComparatorId("ghi")
        ).setId("abc")
      );
    });
    it("should deserialize AttributeNode", () => {
      expect(
        deserialize({
          id: "abc",
          conditionKind: ConditionNodeKind.AND,
          operator: Operators.and,
          children: [
            {
              id: "def",
              nodeKind: NodeKind.Filter,
              filterKind: FilterKind.UserAttribute,
              attribute: "firstName",
              expected: "Thomas",
              performed: false,
              comparator: {
                id: "ghi",
                comparatorKind: ComparatorKind.String,
                operator: Operators.eq,
                nodeKind: NodeKind.Comparator,
              },
            } as SerializedAttributeFilter,
          ],
          nodeKind: NodeKind.Condition,
        })
      ).to.deep.eq(
        Condition.and(
          AttributeFilterNode.new("firstName", "Thomas")
            .setId("def")
            .setComparatorId("ghi")
        ).setId("abc")
      );
    });
  });
});
