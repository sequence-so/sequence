import { expect } from "chai";
import { identify } from "src/events";
import userSeed from "tests/seeds/user.seed";
import { v4 } from "uuid";
import User from "src/models/user.model";
import moment from "moment";
import ProductUser from "src/models/productUser.model";

let user: User;
let mark: ProductUser;

interface IdentifyReservedTraits {
  email?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  phone?: string;
  createdAt?: Date;
  intercomId?: string;
  city?: string;
  companyName?: string;
  country?: string;
  industry?: string;
  title?: string;
  websiteUrl?: string;
  region?: string;
  browser?: string;
  browserVersion?: string;
  browserLanguage?: string;
}

const BROTHERS = ["Donnie Wahlberg", "Robert Wahlberg", "Paul Wahlberg"];

describe("identify", () => {
  before(async () => {
    user = await userSeed();
  });
  after(async () => {
    await ProductUser.destroy({
      where: {
        email: "mark@wahlberg.com",
      },
      force: true,
    });
    await ProductUser.destroy({
      where: {
        externalId: "367146",
      },
      force: true,
    });
  });

  it("should throw on invalid calls", async () => {
    expect(
      identify(
        {
          type: "track",
          event: "My Invalid Call",
          properties: {},
          context: {},
          sentAt: new Date(),
          timestamp: new Date(),
          messageId: v4(),
          receivedAt: new Date(),
          userId: v4(),
        },
        {
          userId: user.id,
        }
      )
    ).to.eventually.throw(
      `Wrong handler used for event type 'track', expected 'identify'`
    );
  });
  it("should fail if neither externalId or email are provided", async () => {
    expect(
      identify(
        {
          type: "identify",
          traits: {
            firstName: "Mark",
            lastName: "Wahlberg",
          },
          context: {},
          sentAt: new Date(),
          timestamp: new Date(),
          receivedAt: new Date(),
          messageId: v4(),
          userId: v4(),
        },
        {
          userId: user.id,
        }
      )
    ).to.eventually.throw("Validation error");
  });
  it("should save identify calls", async () => {
    const timestamp = moment().subtract(2, "minute").toDate();
    const sentAt = moment().subtract(1, "minute").toDate();
    const receivedAt = new Date();
    const messageId = v4();
    const personId = v4();
    const createdAt = moment("06-17-1971", "MM-DD-YYYY").toDate();
    await identify(
      {
        type: "identify",
        traits: {
          email: "mark@wahlberg.com",
          firstName: "Mark",
          lastName: "Wahlberg",
          city: "Dorchester",
          region: "Mass",
          companyName: "Entourage",
          industry: "Entertainment",
          country: "United States",
          createdAt,
          phone: "123-456-7890",
          photo:
            "https://upload.wikimedia.org/wikipedia/commons/5/5f/Mark_Wahlberg_2017.jpg",
          intercomId: "ABCD",
          title: "Execute Director",
          websiteUrl: "https://www.imdb.com/name/nm0000242/",
          brothers: ["Donnie Wahlberg", "Robert Wahlberg", "Paul Wahlberg"],
        } as IdentifyReservedTraits,
        context: {
          device: {
            advertisingId: v4(),
            id: v4(),
            manufacturer: "Apple",
            model: "iPhone 42",
            type: "cellphone",
          },
        },
        sentAt,
        timestamp,
        receivedAt,
        messageId,
        userId: personId,
      },
      {
        userId: user.id,
      }
    );
    mark = await ProductUser.findOne({
      where: {
        email: "mark@wahlberg.com",
      },
    });
    expect(mark.firstName).to.eq("Mark");
    expect(mark.lastName).to.eq("Wahlberg");
    expect(mark.email).to.eq("mark@wahlberg.com");
    expect(mark.city).to.eq("Dorchester");
    expect(mark.region).to.eq("Mass");
    expect(mark.companyName).to.eq("Entourage");
    expect(mark.industry).to.eq("Entertainment");
    expect(mark.country).to.eq("United States");
    expect(mark.signedUpAt.getTime()).to.eq(createdAt.getTime());
    expect(mark.phone).to.eq("123-456-7890");
    expect(mark.photo).to.eq(
      "https://upload.wikimedia.org/wikipedia/commons/5/5f/Mark_Wahlberg_2017.jpg"
    );
    expect(mark.intercomId).to.eq("ABCD");
    expect(mark.title).to.eq("Execute Director");
    expect(mark.websiteUrl).to.eq("https://www.imdb.com/name/nm0000242/");
    expect(mark.traits.brothers).to.deep.eq(BROTHERS);
    expect(mark.externalId).to.eq(personId);
  });
  it("should merge new traits with existing ones", async () => {
    await identify(
      {
        type: "identify",
        traits: {
          firstName: "Thomas",
          numberOfCars: 15,
        } as IdentifyReservedTraits,
        context: {},
        sentAt: new Date(),
        timestamp: new Date(),
        receivedAt: new Date(),
        messageId: v4(),
        userId: mark.externalId,
      },
      {
        userId: user.id,
      }
    );
    const updatedMark = await ProductUser.findOne({
      where: {
        email: mark.email,
      },
    });
    expect(updatedMark.firstName).to.eq("Thomas");
    expect(updatedMark.traits.numberOfCars).to.eq(15);
    expect(updatedMark.traits.brothers).to.deep.eq(BROTHERS);
  });
  it("should unset attributes", async () => {
    await identify(
      {
        type: "identify",
        traits: {
          firstName: null,
          numberOfCars: null,
          brothers: null,
        } as IdentifyReservedTraits,
        context: {},
        sentAt: new Date(),
        timestamp: new Date(),
        receivedAt: new Date(),
        messageId: v4(),
        userId: mark.externalId,
      },
      {
        userId: user.id,
      }
    );
    const updatedMark = await ProductUser.findOne({
      where: {
        email: mark.email,
      },
    });
    expect(updatedMark.firstName).to.eq(null);
    expect(updatedMark.traits.numberOfCars).to.be.undefined;
    expect(updatedMark.traits.brothers).to.be.undefined;
  });
  it("should accept and convert snake_case_attributes for new users", async () => {
    await identify(
      {
        userId: "367146",
        traits: {
          created_at: 1619723330,
          email: "alex@tester.com",
          first_name: "Alex",
          last_name: "Dunham",
        },
        _metadata: { nodeVersion: "14.17.0" },
        type: "identify",
        timestamp: "2021-07-16T01:47:27.109Z",
        messageId: "14oxugf8kr5olfyd",
        context: { library: { sdk: "sequence-node", version: "0.2.8" } },
        sentAt: new Date(),
        receivedAt: new Date(),
      },
      {
        userId: user.id,
      }
    );
    const testUser = await ProductUser.findOne({
      where: {
        externalId: "367146",
      },
    });
    expect(testUser.firstName).to.eq("Alex");
    expect(testUser.lastName).to.eq("Dunham");
    expect(testUser.email).to.eq("alex@tester.com");
    expect(testUser.signedUpAt).to.deep.eq(new Date(1619723330 * 1000));
  });
  it("should accept and convert snake_case_attributes", async () => {
    await identify(
      {
        type: "identify",
        traits: {
          first_name: "First",
          number_of_people: 3,
          browser_version: "12",
        } as IdentifyReservedTraits,
        context: {},
        sentAt: new Date(),
        timestamp: new Date(),
        receivedAt: new Date(),
        messageId: v4(),
        userId: mark.externalId,
      },
      {
        userId: user.id,
      }
    );
    const updatedMark = await ProductUser.findOne({
      where: {
        email: mark.email,
      },
    });
    expect(updatedMark.firstName).to.eq("First");
    expect(updatedMark.browserVersion).to.eq("12");
    expect(updatedMark.traits.number_of_people).to.eq(3);
    expect(updatedMark.traits.firstName).to.be.undefined;
    expect(updatedMark.traits.first_name).to.be.undefined;
  });
  it("should accept the name attribute with only the first name", async () => {
    await identify(
      {
        type: "identify",
        traits: {
          name: "Testname",
        } as IdentifyReservedTraits,
        context: {},
        sentAt: new Date(),
        timestamp: new Date(),
        receivedAt: new Date(),
        messageId: v4(),
        userId: mark.externalId,
      },
      {
        userId: user.id,
      }
    );
    const identifyUser = await ProductUser.findOne({
      where: {
        email: mark.email,
      },
    });
    expect(identifyUser.firstName).to.eq("Testname");
    expect(identifyUser.lastName).to.eq("");
  });
  it("should accept the name attribute with both first and last name", async () => {
    await identify(
      {
        type: "identify",
        traits: {
          name: "Testname     Lastname",
        } as IdentifyReservedTraits,
        context: {},
        sentAt: new Date(),
        timestamp: new Date(),
        receivedAt: new Date(),
        messageId: v4(),
        userId: mark.externalId,
      },
      {
        userId: user.id,
      }
    );
    const identifyUser = await ProductUser.findOne({
      where: {
        email: mark.email,
      },
    });
    expect(identifyUser.firstName).to.eq("Testname");
    expect(identifyUser.lastName).to.eq("Lastname");
  });
});
