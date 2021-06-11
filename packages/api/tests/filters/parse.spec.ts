import { expect } from "chai";
import { Condition, NodeParseError, parse } from "common/filters";
import { AttributeFilterNode, EventFilterNode } from "common/filters/nodes";
import {
  MAX_CONDITION_DEPTH_REACHED,
  EMPTY_ATTRIBUTE,
  EMPTY_EXPECTATION,
  EMPTY_EVENT_PERFORMED,
} from "common/filters/parse/parse";

describe("parse", () => {
  it("should error on max nested depth reached", () => {
    const inner = Condition.and();
    const node = Condition.and(
      Condition.and(Condition.and(Condition.and(inner)))
    );
    const errors: NodeParseError[] = [];
    parse(node, errors);
    expect(errors.length).to.eq(1);
    expect(errors[0].id).to.eq(inner.id);
    expect(errors[0].error).to.eq(MAX_CONDITION_DEPTH_REACHED);
  });
  it("should error on empty attribute", () => {
    const node = AttributeFilterNode.new();
    const errors: NodeParseError[] = [];
    parse(Condition.and(node), errors);
    expect(errors.length).to.eq(1);
    expect(errors[0].id).to.eq(node.id);
    expect(errors[0].error).to.eq(EMPTY_ATTRIBUTE);
  });
  it("should error on empty expectatation", () => {
    const node = Condition.and(AttributeFilterNode.new("firstName"));
    const errors: NodeParseError[] = [];
    parse(node, errors);
    expect(errors.length).to.eq(1);
    expect(errors[0].error).to.eq(EMPTY_EXPECTATION);
  });
  it("should error on EventFilterNode.attribute is not name", () => {
    const node = Condition.and(EventFilterNode.new("Signed Up"));
    const errors: NodeParseError[] = [];
    parse(node, errors);
    expect(errors.length).to.eq(1);
    expect(errors[0].error).to.eq(EMPTY_EVENT_PERFORMED);
  });
  it("should ensure comparator operators exist", () => {
    const inner = EventFilterNode.new("Signed Up");
    const node = Condition.and(inner);
    const errors: NodeParseError[] = [];
    parse(node, errors);
    expect(inner.comparator.operator).to.exist;
  });
});
