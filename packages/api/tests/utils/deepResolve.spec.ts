import { expect } from "chai";
import { deepResolve } from "src/utils/deepResolve";

const promisifyValue = (value: any) =>
  new Promise((resolve) => {
    resolve(value);
  });

describe("deepResolve", () => {
  it("should work on simple types", async () => {
    const object = await deepResolve({});
    expect(object).to.deep.eq(object);
    const array = await deepResolve([]);
    expect(array).to.deep.eq([]);
  });
  it("should resolve deep objects", async () => {
    const object = {
      a: promisifyValue(1),
      b: {
        c: promisifyValue(2),
        d: {
          e: promisifyValue({}),
          f: promisifyValue([]),
          g: {},
          h: [] as any[],
          i: 10,
          j: null as any,
          q: undefined as any,
        },
      },
    };
    const result = await deepResolve(object);
    expect(result).to.deep.eq({
      a: 1,
      b: {
        c: 2,
        d: {
          e: {},
          f: [],
          g: {},
          h: [],
          i: 10,
          j: null,
          q: undefined as any,
        },
      },
    });
  });

  it("should deep resolve arrays", async () => {
    const array = [
      promisifyValue(1),
      promisifyValue([5, 6, 7, [], promisifyValue(["abc", "def"])]),
      promisifyValue({}),
      {},
    ];
    const result = await deepResolve(array);
    expect(result).to.deep.eq([1, [5, 6, 7, [], ["abc", "def"]], {}, {}]);
  });

  it("should deep resolve mixed types", async () => {
    const mixed = {
      a: promisifyValue([
        1,
        2,
        promisifyValue({
          c: "d",
          e: 4,
          f: promisifyValue(["g", 10]),
        }),
      ]),
      h: promisifyValue({
        i: [11, 12, 13],
      }),
    };
    const result = await deepResolve(mixed);
    expect(result).to.deep.eq({
      a: [
        1,
        2,
        {
          c: "d",
          e: 4,
          f: ["g", 10],
        },
      ],
      h: {
        i: [11, 12, 13],
      },
    });
  });
});
