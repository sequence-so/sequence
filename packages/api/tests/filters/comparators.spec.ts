import { expect } from "chai";
import { isEqual } from "lodash";
import {
  AbsoluteDate,
  DateNodeKind,
  NodeKind,
  RelativeDate,
} from "common/filters";
import { AttributeFilterNode } from "common/filters/nodes";
import { Operators } from "common/filters/operators";
import moment from "moment";
import { Op } from "sequelize";
import { Sequelize } from "sequelize";
import { comparatorToQuery } from "src/audience/comparatorToQuery";

describe("comparators", () => {
  describe("dates", () => {
    it("relative date before now", () => {
      // calll each function individually to emulate frontend behavior
      const filter = AttributeFilterNode.new();
      filter.setAttribute("lastSeenAt");
      filter.dateBefore();
      const expectedDate = RelativeDate.from(0);
      filter.setExpected(expectedDate);
      expect(filter.attribute).to.eq("lastSeenAt");
      expect(filter.expected).to.deep.eq({
        id: expectedDate.id,
        nodeKind: NodeKind.Expectation,
        dateKind: DateNodeKind.RELATIVE,
        days: 0,
        reference: "$now",
      });
      const query = comparatorToQuery(filter.comparator, expectedDate, filter);
      const referenceDateString = `'${moment(new Date()).format(
        "YYYY-MM-DD"
      )}'::timestamp`;
      const expectation = {
        [Op[Operators.lt]]: Sequelize.literal(referenceDateString),
      };
      // chai can't do deep equality on Symbols, lodash can
      expect(isEqual(query, expectation)).to.be.true;
    });
    it("relative date after now", () => {
      // calll each function individually to emulate frontend behavior
      const filter = AttributeFilterNode.new();
      filter.setAttribute("lastSeenAt");
      filter.dateAfter();
      const expectedDate = RelativeDate.from(0);
      const referenceFmt = moment().format("YYYY-MM-DD");
      filter.setExpected(expectedDate);
      expect(filter.attribute).to.eq("lastSeenAt");
      expect(filter.expected).to.deep.eq({
        id: expectedDate.id,
        nodeKind: NodeKind.Expectation,
        dateKind: DateNodeKind.RELATIVE,
        days: 0,
        reference: "$now",
      });
      const query = comparatorToQuery(filter.comparator, expectedDate, filter);
      const condition = Sequelize.literal(`'${referenceFmt}'::timestamp`);
      const expectation = {
        [Op[Operators.gt]]: condition,
      };
      expect(isEqual(query, expectation)).to.be.true;
    });
    it("relative date before date in future", () => {
      const filter = AttributeFilterNode.new()
        .setAttribute("lastSeenAt")
        .dateBefore();
      const reference = moment("2020-12-15 00:00:00");
      const referenceFmt = reference.format("YYYY-MM-DD");
      const daysInFuture = 10;
      const expectedDate = RelativeDate.from(daysInFuture, reference.toDate());
      filter.setExpected(expectedDate);
      expect(filter.attribute).to.eq("lastSeenAt");
      expect(filter.expected).to.deep.eq({
        id: expectedDate.id,
        nodeKind: NodeKind.Expectation,
        dateKind: DateNodeKind.RELATIVE,
        days: daysInFuture,
        reference: reference.toDate(),
      });
      const query = comparatorToQuery(filter.comparator, expectedDate, filter);
      const condition = Sequelize.literal(
        `'${referenceFmt}'::timestamp + INTERVAL '10 DAYS'`
      );
      const expectation = {
        [Op[Operators.lt]]: condition,
      };
      expect(isEqual(query, expectation)).to.be.true;
    });
    it("relative date after date in past", () => {
      const filter = AttributeFilterNode.new()
        .setAttribute("lastSeenAt")
        .dateAfter();
      const reference = moment("2020-12-15 00:00:00");
      const referenceFmt = reference.format("YYYY-MM-DD");
      const expectedDate = RelativeDate.from(-3, reference.toDate());
      filter.setExpected(expectedDate);
      expect(filter.attribute).to.eq("lastSeenAt");
      expect(filter.expected).to.deep.eq({
        id: expectedDate.id,
        nodeKind: NodeKind.Expectation,
        dateKind: DateNodeKind.RELATIVE,
        days: -3,
        reference: reference.toDate(),
      });
      const query = comparatorToQuery(filter.comparator, expectedDate, filter);
      const condition = Sequelize.literal(
        `'${referenceFmt}'::timestamp - INTERVAL '3 DAYS'`
      );
      const expectation = {
        [Op[Operators.gt]]: condition,
      };
      expect(isEqual(query, expectation)).to.be.true;
    });
    it("before absolute date", () => {
      const filter = AttributeFilterNode.new()
        .setAttribute("lastSeenAt")
        .dateBefore();
      const reference = moment().add("1 year");
      const referenceFmt = reference.format("YYYY-MM-DD");
      const expectedDate = AbsoluteDate.on(reference.toDate());
      filter.setExpected(expectedDate);
      expect(filter.attribute).to.eq("lastSeenAt");
      expect(filter.expected).to.deep.eq({
        id: expectedDate.id,
        nodeKind: NodeKind.Expectation,
        dateKind: DateNodeKind.ABSOLUTE,
        reference: reference.toDate(),
      });
      const query = comparatorToQuery(filter.comparator, expectedDate, filter);
      const expectation = {
        [Op[Operators.lt]]: referenceFmt,
      };
      expect(isEqual(query, expectation)).to.be.true;
    });
  });
});
