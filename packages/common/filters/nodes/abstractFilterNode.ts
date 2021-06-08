import AbstractComparator from "../comparators/abstractComparatorNode";
import AbstractDateNode from "../date/abstractDateNode";
import AbstractNode from "./abstractNode";
import { FilterKind, NodeKind } from "../syntaxKind";
import DateComparator from "../comparators/dateComparator";
import StringComparator from "../comparators/stringComparator";
import { Operators } from "../operators";
import DateTypeComparator from "../comparators/dateTypeComparator";
import AbstractComparatorNode from "../comparators/abstractComparatorNode";

abstract class AbstractFilterNode extends AbstractNode {
  nodeKind: NodeKind.Filter = NodeKind.Filter;
  abstract filterKind: FilterKind;
  attribute: string | undefined;
  comparator: AbstractComparator | undefined;
  expected: any;
  constructor(attribute?: string, expected?: any) {
    super();
    this.attribute = attribute;
    this.expected = expected;
  }
  get table(): string {
    throw new Error("Function not implemented");
  }
  gt(expected?: any) {
    this.comparator = StringComparator.new(Operators.gt);
    this.expected = expected;
    return this;
  }
  gte(expected?: any) {
    this.comparator = StringComparator.new(Operators.gte);
    this.expected = expected;
    return this;
  }
  lt(expected?: any) {
    this.comparator = StringComparator.new(Operators.lt);
    this.expected = expected;
    return this;
  }
  lte(expected?: any) {
    this.comparator = StringComparator.new(Operators.lte);
    this.expected = expected;
    return this;
  }
  between(min: any, max: any) {
    this.comparator = StringComparator.new(Operators.lte);
    this.expected = [min, max];
    return this;
  }
  exists() {
    this.comparator = StringComparator.new(Operators.ne);
    this.expected = null;
    return this;
  }
  doesNotExist() {
    this.comparator = StringComparator.new(Operators.eq);
    this.expected = "";
    return this;
  }
  dateBefore(date?: AbstractDateNode) {
    this.comparator = DateComparator.new(Operators.lt);
    this.expected = date;
    return this;
  }
  dateAfter(date?: AbstractDateNode) {
    this.comparator = DateComparator.new(Operators.gt);
    this.expected = date;
    return this;
  }
  isDate(attribute?: string) {
    this.comparator = DateTypeComparator.new(attribute!, true);
    return this;
  }
  isNotDate(attribute?: string) {
    this.comparator = DateTypeComparator.new(attribute!, false);
    return this;
  }
  equals(expected?: any) {
    this.comparator = StringComparator.new(Operators.eq);
    this.expected = expected;
    return this;
  }
  notEquals(expected?: any) {
    this.comparator = StringComparator.new(Operators.ne);
    this.expected = expected;
    return this;
  }
  contains(expected: string) {
    this.comparator = StringComparator.new(Operators.like);
    this.expected = expected;
    return this;
  }
  // alias
  is(expected?: any): this {
    return this;
  }
  setComparator(comparator: AbstractComparatorNode): this {
    this.comparator = comparator;
    return this;
  }
  getOperators() {
    return [
      { label: "Equals", value: "equals", args: 1 },
      { label: "Not equals", value: "notEquals", args: 1 },
      { label: "Greater than", value: "gt", args: 1 },
      { label: "Greater than or equal to", value: "gte", args: 1 },
      { label: "Less than", value: "lt", args: 1 },
      { label: "Less than or equal to", value: "lte", args: 1 },
      { label: "Between", value: "between", args: 2 },
      { label: "Exists", value: "exists", args: 0 },
      { label: "Does not exist", value: "doesNotExist", args: 0 },
      { label: "Is after date", value: "dateAfter", args: 1 },
      { label: "Is before date", value: "dateBefore", args: 1 },
      { label: "Is a timestamp", value: "isDate", args: 0 },
      { label: "Is not a timestamp", value: "isNotDate", args: 0 },
      { label: "Contains", value: "contains", args: 1 },
    ];
  }
  setComparatorId(id: string) {
    if (this.comparator) {
      this.comparator.id = id;
    }
    return this;
  }
}
AbstractFilterNode.prototype.is = AbstractFilterNode.prototype.equals;

export default AbstractFilterNode;
