import { expect, util } from "chai";
import { inspect } from "util";
import {
  ComparatorKind,
  Condition,
  ConditionNodeKind,
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

describe("serialize", () => {
  describe("transformer functions", () => {
    it("should serialize Condition.and", () => {
      const node = Condition.and();
      expect(serializeConditionNode(node)).to.deep.eq({
        id: node.id,
        nodeKind: NodeKind.Condition,
        children: [],
        conditionKind: ConditionNodeKind.AND,
        operator: Operators.and,
      });
    });
    it("should serialize Condition.or", () => {
      const node = Condition.or();
      expect(serializeConditionNode(node)).to.deep.eq({
        id: node.id,
        nodeKind: NodeKind.Condition,
        children: [],
        conditionKind: ConditionNodeKind.OR,
        operator: Operators.or,
      });
    });
    it("should serialize EventFilter", () => {
      const node = EventFilter.new("My Event Name").hasBeenPerformed();
      expect(serializeEventFilterNode(node)).to.deep.eq({
        id: node.id,
        nodeKind: NodeKind.Filter,
        filterKind: FilterKind.Event,
        attribute: "name",
        expected: "My Event Name",
        performed: true,
        comparator: {
          id: node.comparator.id,
          comparatorKind: ComparatorKind.String,
          operator: Operators.eq,
          nodeKind: NodeKind.Comparator,
        },
      } as SerializedEventFilter);
    });
    // it("should serialize EventAttributeNode", () => {
    //   const node = EventAttributeNode.new("Sign Up").contains()
    //   expect(serializeEventFilterNode(node)).to.deep.eq({
    //     nodeKind: NodeKind.Value,
    //     filterKind: FilterKind.Event,
    //     attribute: "name",
    //     expected: "My Event Name",
    //     performed: true,
    //     comparator: {
    //       comparatorKind: ComparatorKind.String,
    //       operator: Operators.eq,
    //       nodeKind: NodeKind.Comparator,
    //     },
    //   } as SerializedEventFilter);
    // });
  });

  it("should serialize and condition", () => {
    const node = Condition.and();
    expect(serialize(node)).to.deep.eq({
      id: node.id,
      nodeKind: NodeKind.Condition,
      children: [],
      conditionKind: ConditionNodeKind.AND,
      operator: Operators.and,
    });
  });
  it("should serialize or condition", () => {
    const node = Condition.or();
    expect(serialize(node)).to.deep.eq({
      id: node.id,
      nodeKind: NodeKind.Condition,
      children: [],
      conditionKind: ConditionNodeKind.OR,
      operator: Operators.or,
    });
  });
  it("should serialize an event filter", () => {
    const node = EventFilter.new("Sign Up").hasBeenPerformed();
    const condition = Condition.and(node);
    expect(serialize(condition)).to.deep.eq({
      id: condition.id,
      nodeKind: NodeKind.Condition,
      conditionKind: ConditionNodeKind.AND,
      operator: Operators.and,
      children: [
        {
          id: node.id,
          nodeKind: NodeKind.Filter,
          attribute: "name",
          expected: "Sign Up",
          filterKind: FilterKind.Event,
          performed: true,
          comparator: {
            id: node.comparator.id,
            comparatorKind: ComparatorKind.String,
            operator: Operators.eq,
            nodeKind: NodeKind.Comparator,
          } as SerializedComparatorNode,
        } as SerializedEventFilter,
      ],
    });
  });
  it("should serialize attribute filter", () => {
    const filter = AttributeFilterNode.new("city").contains("Lake");
    const node = Condition.and(filter);
    expect(serialize(node)).to.deep.eq({
      id: node.id,
      nodeKind: NodeKind.Condition,
      conditionKind: ConditionNodeKind.AND,
      operator: Operators.and,
      children: [
        {
          id: filter.id,
          nodeKind: NodeKind.Filter,
          filterKind: FilterKind.UserAttribute,
          attribute: "city",
          expected: "Lake",
          comparator: {
            id: filter.comparator.id,
            comparatorKind: ComparatorKind.String,
            operator: Operators.like,
            nodeKind: NodeKind.Comparator,
          } as SerializedComparatorNode,
        } as SerializedAttributeFilter,
      ],
    });
  });
  it("should serialize mixed conditions", () => {
    const node = Condition.or();
    const first = Condition.and(
      EventFilterNode.new("Invite Sent").hasBeenPerformed()
    );
    const second = Condition.and(
      EventFilterNode.new("Invite Sent").hasNotBeenPerformed()
    );
    node.addChild(first);
    node.addChild(second);
    const result = serialize(node);
    expect(result).to.deep.eq({
      id: node.id,
      nodeKind: NodeKind.Condition,
      conditionKind: ConditionNodeKind.OR,
      operator: Operators.or,
      children: [
        {
          id: first.id,
          nodeKind: NodeKind.Condition,
          conditionKind: ConditionNodeKind.AND,
          operator: Operators.and,
          children: [
            {
              id: first.children[0].id,
              nodeKind: NodeKind.Filter,
              filterKind: FilterKind.Event,
              attribute: "name",
              expected: "Invite Sent",
              performed: true,
              comparator: {
                id: (first.children[0] as EventFilterNode).comparator.id,
                comparatorKind: ComparatorKind.String,
                operator: Operators.eq,
                nodeKind: NodeKind.Comparator,
              } as SerializedComparatorNode,
            } as SerializedEventFilter,
          ],
        },
        {
          id: second.id,
          nodeKind: NodeKind.Condition,
          conditionKind: ConditionNodeKind.AND,
          operator: Operators.and,
          children: [
            {
              id: second.children[0].id,
              nodeKind: NodeKind.Filter,
              filterKind: FilterKind.Event,
              attribute: "name",
              expected: "Invite Sent",
              performed: false,
              comparator: {
                id: (second.children[0] as EventFilterNode).comparator.id,
                comparatorKind: ComparatorKind.String,
                operator: Operators.eq,
                nodeKind: NodeKind.Comparator,
              } as SerializedComparatorNode,
            } as SerializedEventFilter,
          ],
        },
      ],
    });
  });
});
