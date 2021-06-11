import {
  AttributeFilter,
  Condition,
  EventFilter,
  PageFilter,
  stringify,
} from "common/filters";
import { expect } from "chai";

describe("test filter creation", () => {
  it("should create an id for a filter", () => {
    const filter = EventFilter.new("upgrade").hasBeenPerformed();
    expect(filter.id).to.not.be.null;
  });
  it("should generate a simple AST", () => {
    const node = Condition.and(
      EventFilter.new("upgrade").hasBeenPerformed(),
      Condition.or(
        EventFilter.new("other_attribute").is("my_value"),
        EventFilter.new("a_last_attribute").is("my_value")
      )
    );
    expect(stringify(node)).to.eql(first);
  });
  it("should handle page filter types", () => {
    const node = Condition.and(
      PageFilter.new("url")
        .is("https://yoursite.com/featuredemo")
        .hasBeenViewed(),
      Condition.or(
        AttributeFilter.new("role").equals("marketer"),
        AttributeFilter.new("role").equals("designer")
      ),
      EventFilter.new("upgrade").hasBeenPerformed()
    );
    expect(stringify(node)).to.eql(second);
  });
  it("should allow for deep nested conditions", () => {
    const node = Condition.and(
      Condition.or(
        Condition.or(
          Condition.or(
            EventFilter.new("upgrade").hasBeenPerformed(),
            EventFilter.new("signup").hasBeenPerformed()
          ),
          EventFilter.new("Playlist Added").hasBeenPerformed()
        ),
        EventFilter.new("Playlist Removed").hasBeenPerformed()
      ),
      EventFilter.new("upgrade").hasBeenPerformed()
    );
    expect(stringify(node)).to.eql(third);
  });
});

const first = `All[
  Event.name.is equal to.upgrade.has been performed,
  At least one[
    Event.name.is equal to.my_value,
    Event.name.is equal to.my_value,
  ],
],\n`;

const second = `All[
  Page.url.is equal to.https://yoursite.com/featuredemo.has been viewed,
  At least one[
    Attribute.role.is equal to.marketer,
    Attribute.role.is equal to.designer,
  ],
  Event.name.is equal to.upgrade.has been performed,
],\n`;

const third = `All[
  At least one[
    At least one[
      At least one[
        Event.name.is equal to.upgrade.has been performed,
        Event.name.is equal to.signup.has been performed,
      ],
      Event.name.is equal to.Playlist Added.has been performed,
    ],
    Event.name.is equal to.Playlist Removed.has been performed,
  ],
  Event.name.is equal to.upgrade.has been performed,
],\n`;
