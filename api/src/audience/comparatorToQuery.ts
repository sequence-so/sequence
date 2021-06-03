import moment from "moment";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import { ComparatorKind, DateNodeKind } from "common/filters";
import AbstractComparatorNode from "common/filters/comparators/abstractComparatorNode";
import DateComparator from "common/filters/comparators/dateComparator";
import DateTypeComparator from "common/filters/comparators/dateTypeComparator";
import StringComparator from "common/filters/comparators/stringComparator";
import AbstractDateNode from "common/filters/date/abstractDateNode";
import RelativeDateNode from "common/filters/date/relativeDateNode";
import { AbstractFilterNode } from "common/filters/nodes";

export const comparatorToQuery = (
  comparator: AbstractComparatorNode,
  expected: any,
  node: AbstractFilterNode
) => {
  switch (comparator.comparatorKind) {
    case ComparatorKind.String:
      return processStringComparator(
        comparator as StringComparator,
        expected,
        node
      );
    case ComparatorKind.Date:
      return processDateComparator(
        comparator as DateComparator,
        expected as AbstractDateNode,
        node
      );
    case ComparatorKind.IsTimestamp:
      return processIsTimestampComparator(
        comparator as DateTypeComparator,
        expected,
        node
      );
    case ComparatorKind.Number:
      return;
  }
};

const processStringComparator = (
  comparator: StringComparator,
  expected: string,
  node: AbstractFilterNode
) => {
  if (comparator.operator === "like") {
    return { [Op[comparator.operator]]: `%${expected}%` };
  } else {
    return { [Op[comparator.operator]]: expected };
  }
};

const processDateComparator = (
  comparator: DateComparator,
  expected: AbstractDateNode,
  node: AbstractFilterNode
) => {
  if (expected.dateKind === DateNodeKind.ABSOLUTE) {
    const reference = moment(expected.reference).format("YYYY-MM-DD");
    return { [Op[comparator.operator]]: reference };
  } else if (expected.dateKind === DateNodeKind.RELATIVE) {
    const relativeDateNode = expected as RelativeDateNode;
    const days = relativeDateNode.days;
    const sign = days < 0 ? "-" : "+";
    const referenceDate =
      relativeDateNode.reference === "$now"
        ? new Date()
        : relativeDateNode.reference;
    const referenceDateString = `'${moment(referenceDate).format(
      "YYYY-MM-DD"
    )}'::timestamp`;

    if (days === 0) {
      return {
        [Op[comparator.operator]]: Sequelize.literal(referenceDateString),
      };
    }
    return {
      [Op[comparator.operator]]: Sequelize.literal(
        `${referenceDateString} ${sign} INTERVAL '${Math.abs(days)} DAYS'`
      ),
    };
  } else if (expected.dateKind === DateNodeKind.IS_TIMESTAMP) {
    return Sequelize.literal(`get_date(${[node.attribute]}`);
  }
};

const processIsTimestampComparator = (
  comparator: DateTypeComparator,
  _: AbstractDateNode,
  node: AbstractFilterNode
) => {
  return Sequelize.literal(
    `is_date("${node.table}"."${[comparator.attributeName]}"::varchar) = ${
      comparator.value
    }`
  );
};
