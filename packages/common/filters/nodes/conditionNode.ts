import AbstractNode from "./abstractNode";
import { ConditionNodeKind, NodeKind } from "../syntaxKind";
import { Operators } from "../operators";
import { inspect } from "util";

class ConditionNode extends AbstractNode {
  nodeKind: NodeKind.Condition = NodeKind.Condition;
  conditionKind: ConditionNodeKind;
  operator: Operators;
  children: AbstractNode[] = [];
  private constructor(type: ConditionNodeKind, children?: AbstractNode[]) {
    super();
    this.conditionKind = type;
    this.operator =
      this.conditionKind === ConditionNodeKind.AND
        ? Operators.and
        : Operators.or;
    this.children = children || [];
    return this;
  }
  static and(...children: AbstractNode[]) {
    let instance = new ConditionNode(ConditionNodeKind.AND, children);
    return instance;
  }
  static or(...children: AbstractNode[]) {
    let instance = new ConditionNode(ConditionNodeKind.OR, children);
    return instance;
  }
  setChildren(children: AbstractNode[]) {
    this.children = children;
    return this;
  }
  addChild(child: AbstractNode) {
    this.children?.push(child);
  }
  removeChild(child: AbstractNode) {
    // TODO
  }
  isAnd() {
    return this.conditionKind === ConditionNodeKind.AND;
  }
  isOr() {
    return this.conditionKind === ConditionNodeKind.OR;
  }
  toString() {
    if (this.conditionKind === ConditionNodeKind.AND) {
      return "All";
    }
    return "At least one";
  }
  print() {
    console.log(inspect(this, false, 5, true));
  }
}

export default ConditionNode;
