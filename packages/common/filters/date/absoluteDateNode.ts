import { DateNodeKind } from "../syntaxKind";
import AbstractDateNode from "./abstractDateNode";

class AbsoluteDateNode extends AbstractDateNode {
  dateKind = DateNodeKind.ABSOLUTE;
  private constructor(reference: Date) {
    super();
    this.reference = reference;
  }
  static on(date: Date) {
    let instance = new AbsoluteDateNode(date);
    return instance;
  }
}

export default AbsoluteDateNode;
