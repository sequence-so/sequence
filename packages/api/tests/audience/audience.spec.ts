import { expect } from "chai";
import moment from "moment";
import {
  AttributeFilter,
  Condition,
  EventAttribute,
  EventFilter,
  RelativeDate,
} from "common/filters";
import { AudienceBuilder } from "src/audience";
import Event from "src/models/event.model";
import ProductUser from "src/models/productUser.model";
import productUserSeed from "tests/seeds/productUser.seed";
import userSeed from "tests/seeds/user.seed";
import eventSeed from "tests/seeds/event.seed";
import User from "src/models/user.model";
const AND = Condition.and;

describe("event filter", () => {
  let user: User;
  beforeEach(async () => {
    await ProductUser.destroy({
      where: {
        city: "Los Angeles",
      },
    });
    user = await userSeed();
    const john = await productUserSeed({
      firstName: "John",
      city: "Los Angeles",
      userId: user.id,
    });
    await eventSeed({
      name: "Signed In",
      personId: john.externalId,
      userId: user.id,
    });
    await productUserSeed({
      firstName: "Tommy",
      city: "New York City",
      userId: user.id,
    });
  });
  it("should query for users that have performed an event", async () => {
    const eventCount = await Event.count({
      where: {
        name: "Signed In",
        userId: user.id,
      },
      group: "personId",
    });
    const node = AND(EventFilter.new("Signed In").hasBeenPerformed());
    const builder = new AudienceBuilder(node, user.id);
    builder.build();
    const audience = await builder.execute();
    expect(audience.length).to.eq(eventCount.length).to.eq(1);
  });
  it("should query for users that have not performed an event", async () => {
    const eventCount = await ProductUser.findAll({
      attributes: [`ProductUser.id`],
      where: {
        //@ts-ignore
        "$events.id$": null,
        userId: user.id,
      },
      include: [
        {
          model: Event,
          as: "events",
          attributes: ["id"],
          required: false,
          where: {
            name: "Signed In",
          },
        },
      ],
    });

    const node = AND(EventFilter.new("Signed In").hasNotBeenPerformed());
    const builder = new AudienceBuilder(node, user.id);
    builder.build();
    const audience = await builder.execute();
    expect(audience.length).to.eq(eventCount.length);
  });
});

describe("attribute filter", () => {
  beforeEach(async () => {
    await ProductUser.destroy({
      where: {
        city: "New York City",
      },
    });
  });
  it("should filter for a string attribute", async () => {
    const user = await userSeed();
    await productUserSeed({
      firstName: "John",
      city: "New York City",
      userId: user.id,
    });
    await productUserSeed({
      firstName: "Tommy",
      city: "New York City",
      userId: user.id,
    });
    const node = AND(AttributeFilter.new("city").is("New York City"));
    const builder = new AudienceBuilder(node, user.id);
    builder.build();
    const audience = await builder.execute();
    expect(audience.length).to.eq(2);
  });
  it("should filter for before a relative date", async () => {
    const user = await userSeed();
    await productUserSeed({
      userId: user.id,
      city: "New York City",
      signedUpAt: moment().subtract(1, "month").toDate(),
    });
    await productUserSeed({
      userId: user.id,
      city: "New York City",
      signedUpAt: moment().subtract(2, "month").toDate(),
    });
    await productUserSeed({
      userId: user.id,
      city: "New York City",
      signedUpAt: moment().subtract(3, "month").toDate(),
    });
    const signedUpbefore10DaysAgo = AND(
      AttributeFilter.new("signedUpAt").dateBefore(
        RelativeDate.from(-10, new Date())
      )
    );
    const signedUpbefore40DaysAgo = AND(
      AttributeFilter.new("signedUpAt").dateBefore(
        RelativeDate.from(-40, new Date())
      )
    );

    const audience = await new AudienceBuilder(signedUpbefore10DaysAgo, user.id)
      .build()
      .execute();
    expect(audience.length).to.eq(3);

    const audience2 = await new AudienceBuilder(
      signedUpbefore40DaysAgo,
      user.id
    )
      .build()
      .execute();
    expect(audience2.length).to.eq(2);
  });

  it("should filter after a relative date", async () => {
    const user = await userSeed();
    await productUserSeed({
      userId: user.id,
      city: "New York City",
      signedUpAt: moment().add(5, "day").toDate(),
    });
    await productUserSeed({
      userId: user.id,
      city: "New York City",
      signedUpAt: moment().toDate(),
    });
    await productUserSeed({
      userId: user.id,
      city: "New York City",
      signedUpAt: moment().subtract(5, "days").toDate(),
    });
    const signedUpAfterYesterday = AND(
      AttributeFilter.new("signedUpAt").dateAfter(
        RelativeDate.from(-1, new Date())
      )
    );
    const audience = await new AudienceBuilder(signedUpAfterYesterday, user.id)
      .build()
      .execute();
    expect(audience.length).to.eq(2);
  });
});

describe("event attribute", () => {
  it("should query for event attributes", async () => {
    const user = await userSeed();
    const tom = await productUserSeed({
      userId: user.id,
      city: "New York City",
      signedUpAt: moment().add(5, "day").toDate(),
    });
    await eventSeed({
      userId: user.id,
      personId: tom.externalId,
      type: "track",
      name: "Clicked a Button",
      properties: {
        color: "green",
      },
    });
    const john = await productUserSeed({
      userId: user.id,
      city: "New York City",
      signedUpAt: moment().add(5, "day").toDate(),
    });
    await eventSeed({
      userId: user.id,
      personId: john.externalId,
      type: "track",
      name: "Clicked a Button",
      properties: {
        color: "green",
      },
    });
    const clickedAButtonEvent = AND(
      EventAttribute.new("Clicked a Button")
        .setAttribute("color")
        .equals("green")
    );
    const audience = await new AudienceBuilder(clickedAButtonEvent, user.id)
      .build()
      .execute();
    expect(audience.length).to.eq(2);
  });
});

describe("event attribute", () => {
  beforeEach(async () => {
    await ProductUser.destroy({
      where: {
        city: "New York City",
      },
    });
    await Event.destroy({
      where: {
        name: "Onboarding Started",
      },
    });
  });
  it.skip("should ensure timestamp type", async () => {
    const user = await userSeed();
    const tom = await productUserSeed({
      userId: user.id,
      city: "New York City",
      signedUpAt: moment().add(5, "day").toDate(),
    });
    await eventSeed({
      userId: user.id,
      personId: tom.externalId,
      type: "track",
      name: "Onboarding Started",
    });

    const onboardingEvent = AND(
      EventAttribute.new("Onboarding Started")
        .setAttribute("createdAt")
        .isDate("createdAt")
    );
    const audience = await new AudienceBuilder(onboardingEvent, user.id)
      .build()
      .execute();
    expect(audience.length).to.eq(1);
  });
  it.skip("should ensure not a timestamp type", async () => {
    const user = await userSeed();
    const tom = await productUserSeed({
      userId: user.id,
      city: "New York City",
      signedUpAt: moment().add(5, "day").toDate(),
    });
    await eventSeed({
      userId: user.id,
      personId: tom.externalId,
      type: "track",
      name: "Onboarding Started",
    });

    const onboardingEvent = AND(
      EventAttribute.new("Onboarding Started")
        .setAttribute("signedUpAt")
        .isNotDate("signedUpAt")
    );
    const audience = await new AudienceBuilder(onboardingEvent, user.id)
      .build()
      .execute();
    expect(audience.length).to.eq(0);
    const onboardingEvent2 = AND(
      EventAttribute.new("Onboarding Started")
        .setAttribute("name")
        .isNotDate("name")
    );
    const audience2 = await new AudienceBuilder(onboardingEvent2, user.id)
      .build()
      .execute();
    expect(audience2.length).to.eq(1);
  });
});
