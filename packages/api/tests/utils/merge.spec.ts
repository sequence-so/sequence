import { expect } from "chai";
import QueryResult from "src/audience/queryResult";

const id = (val: number) => ({ id: `${val}` });

describe.only("queryResult", () => {
  // it
  let result = new QueryResult();

  // describe("shallow", () => {
  //   it("should merge with and", () => {
  //     const result = merge({
  //       and: [[id(1), id(2)], [id(1)]],
  //       or: [],
  //     });
  //     expect(result).to.deep.equal([id(1)]);
  //   });
  //   it("should merge with or", () => {
  //     const result = merge({
  //       and: [],
  //       or: [
  //         [id(1), id(2), id(10)],
  //         [id(1), id(3)],
  //       ],
  //     });
  //     expect(result).to.deep.equal([id(1), id(2), id(10), id(3)]);
  //   });
  //   it("should merge with both and produce only unique values", () => {
  //     const result = merge({
  //       and: [
  //         [id(1), id(2)],
  //         [id(2), id(3)],
  //       ],
  //       or: [[id(6), id(8)], [id(10)]],
  //     });
  //     expect(result).to.deep.equal([id(2), id(6), id(8), id(10)]);
  //   });
  // });
  // describe("deep", () => {
  //   // it.only("should be empty merge when sibling and has empty array", () => {
  //   //   const result = mergeAnd({

  //   //       [id(100), id(101), id(200)],
  //   //       {
  //   //         and: [[]],
  //   //         or: [],
  //   //       },
  //   //     ],
  //   //     or: [],
  //   //   });
  //   //   expect(result).to.deep.equal([]);
  //   // });
  //   it.only("should choose non-empty when merging empty and with non-empty and", () => {
  //     const result = merge({
  //       and: [
  //         [id(100), id(101), id(200)],
  //         {
  //           and: [],
  //           or: [],
  //         },
  //       ],
  //       or: [],
  //     });
  //     expect(result).to.deep.equal([id(100), id(101), id(200)]);
  //   });
  //   it("should deeply merge with ands", () => {
  //     const result = merge({
  //       and: [
  //         [id(100), id(101), id(200)],
  //         [id(101), id(200)],
  //         {
  //           and: [[id(100), id(101), id(200), id(201)]],
  //           or: [],
  //         },
  //       ],
  //       or: [],
  //     });
  //     expect(result).to.deep.equal([id(101), id(200)]);
  //   });
  //   it("should deeply merge with ors", () => {
  //     const result = merge({
  //       and: [
  //         {
  //           and: [],
  //           or: [],
  //         },
  //       ],
  //       or: [
  //         [id(100), id(101), id(200)],
  //         [id(101), id(200)],
  //         [id(100), id(101), id(200), id(201)],
  //       ],
  //     });
  //     expect(result).to.deep.equal([id(100), id(101), id(200), id(201)]);
  //   });
  // });
});
