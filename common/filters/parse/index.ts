import parse from "./parse";
import scanner from "./scanner";
import visit from "./visit";

export { parse, scanner, visit };

export const SCANNER_OPERAND_ERROR =
  "Expected at least two operands in condition";
