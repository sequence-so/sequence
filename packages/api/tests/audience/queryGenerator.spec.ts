import { expect } from "chai";
import { EventFilter } from "common/filters";
import { Op } from "sequelize";
import App from "src/app";
import QueryGenerator from "src/audience/queryGenerator";
import Event from "src/models/event.model";
import User from "src/models/user.model";
import userSeed from "tests/seeds/user.seed";
import { isEqualWith } from "lodash";

let app: App;
let user: User;
let queryGenerator: QueryGenerator;

const isSequelizeModel = (a: any) => typeof a.tableName === "string";

/**
 * Deeply comparing Sequelize models hangs the _.isEqual function.
 * We implement a custom isEquals method which compares the Model.tableName
 * attribute which is enough for our purposes.
 *
 * @param a Object
 * @param b Object
 * @returns Boolean or undefined if we don't care about this comparison
 */
const customizer = (a: any, b: any) => {
  if (typeof a === "object" && typeof b === "object") {
    if (isSequelizeModel(a) && isSequelizeModel(b)) {
      return a.tableName === b.tableName;
    }
  }
  return undefined;
};

const isEqual = (a: any, b: any) => isEqualWith(a, b, customizer);

describe("query generator", function () {
  before(async () => {
    app = new App();
    user = await userSeed();
    queryGenerator = new QueryGenerator(user.id, {
      productUserId: "123",
    });
  });

  describe("event filter node", () => {
    it("should generate event node query for event has been performed", () => {
      queryGenerator = new QueryGenerator(user.id);
      const eventFilter = EventFilter.new("A Tracked Event").hasBeenPerformed();

      expect(
        isEqual(queryGenerator.onEventNode(eventFilter), {
          where: {
            //@ts-ignore
            "$events.name$": {
              [Op.eq]: "A Tracked Event",
            },
            "$events.userId$": user.id,
            userId: user.id,
          },
          include: [
            {
              model: Event,
              as: "events",
              attributes: [],
            },
          ],
          group: "ProductUser.id",
        })
      ).to.be.true;
    });
    it("should generate event node query for event has been not performed", () => {
      queryGenerator = new QueryGenerator(user.id);
      const eventFilter =
        EventFilter.new("A Tracked Event").hasNotBeenPerformed();

      isEqual(queryGenerator.onEventNode(eventFilter), {
        where: {
          //@ts-ignore
          "$events.name$": {
            [Op.ne]: "123",
          },
          "$events.userId$": user.id,
          userId: user.id,
        },
        include: [
          {
            model: Event,
            as: "events",
            attributes: [],
          },
        ],
        group: "ProductUser.id",
      });
    });
    it("should generate event node query for event has been performed for one user", () => {
      queryGenerator = new QueryGenerator(user.id, {
        productUserId: "123",
      });
      const eventFilter = EventFilter.new("A Tracked Event").hasBeenPerformed();

      expect(
        isEqual(queryGenerator.onEventNode(eventFilter), {
          where: {
            ["ProductUser.id"]: "123",
            //@ts-ignore
            "$events.name$": {
              [Op.eq]: "123",
            },
            "$events.userId$": user.id,
            userId: user.id,
          },
          include: [
            {
              model: "Event",
              as: "events",
              attributes: [],
            },
          ],
          group: "ProductUser.id",
        })
      );
    });
    it.skip("should generate event node query for event has been not performed for one user", () => {
      queryGenerator = new QueryGenerator(user.id, {
        productUserId: "123",
      });
      const eventFilter =
        EventFilter.new("A Tracked Event").hasNotBeenPerformed();

      expect(
        isEqual(queryGenerator.onEventNode(eventFilter), {
          where: {
            ["ProductUser.id"]: "123",
            //@ts-ignore
            "$events.name$": {
              [Op.ne]: "123",
            },
            "$events.userId$": user.id,
            userId: user.id,
          },
          include: [
            {
              model: Event,
              as: "events",
              attributes: [],
            },
          ],
          group: "ProductUser.id",
        })
      );
    });
  });

  // describe("event attribute node", () => {});

  // describe("user attribute node", () => {});

  // describe("page filter node", () => {});

  // describe("email filter node", () => {});
});
