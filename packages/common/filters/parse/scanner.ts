import AbstractNode from "../nodes/abstractNode";
import ConditionNode from "../nodes/conditionNode";
import SyntaxKind, { NodeKind } from "../syntaxKind";

type NodeType = AbstractNode | ConditionNode;

const createScanner = (node: AbstractNode) => {
  let currNode: AbstractNode | undefined = node;
  let token: SyntaxKind | null = null;
  let arrayIdx: number | undefined = undefined;
  let prevParent: NodeType[] = [];
  let prevIdx: number[] = [];

  const inArray = () => typeof arrayIdx === "number";
  const isLeaf = () => currNode!.nodeKind === NodeKind.Filter && !inArray();

  return {
    scan: () => {
      token = null;
      if (!currNode) {
        return (token = SyntaxKind.Done);
      }
      if (isLeaf()) {
        arrayIdx = (prevIdx.pop() as number) + 1;
        currNode = prevParent.pop();
        return (token = SyntaxKind.EndOperand);
      }
      if (inArray()) {
        if (
          currNode.nodeKind === NodeKind.Condition &&
          (arrayIdx as number) >= (currNode as ConditionNode).children!.length
        ) {
          arrayIdx = (prevIdx.pop() as number) + 1;
          currNode = prevParent.pop();
          if (currNode) {
            return (token = SyntaxKind.EndCondition);
          }
          return (token = SyntaxKind.Done);
        }
        prevParent.push(currNode);
        prevIdx.push(arrayIdx!);
        currNode = (currNode as ConditionNode).children![arrayIdx!];
      }
      if (currNode.nodeKind === NodeKind.Condition) {
        arrayIdx = 0;
        return (token = SyntaxKind.BeginCondition);
      }
      arrayIdx = undefined;
      return (token = SyntaxKind.ValueNode);
    },
    getNode: () => currNode,
    getToken: () => token,
  };
};

export default createScanner;
