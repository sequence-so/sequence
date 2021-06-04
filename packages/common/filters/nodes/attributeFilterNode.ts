import AbstractFilterNode from "./abstractFilterNode";
import AbstractComparatorNode from "../comparators/abstractComparatorNode";
import { FilterKind } from "../syntaxKind";

class AttributeFilterNode extends AbstractFilterNode {
  filterKind: FilterKind.UserAttribute = FilterKind.UserAttribute;
  comparator: AbstractComparatorNode | undefined;
  expected: string | number | undefined;
  private constructor(attribute?: string, expected?: any) {
    super(attribute, expected);
    this.equals(expected);
  }
  static new(attribute?: string, expected?: any) {
    return new AttributeFilterNode(attribute, expected);
  }
  getFilterOptions() {
    return [
      { label: "First name", value: "firstName" },
      { label: "Last name", value: "lastName" },
      { label: "Email", value: "email" },
      { label: "Photo", value: "photo" },
      { label: "Phone", value: "phone" },
      { label: "Signed up at", value: "signedUpAt" },
      { label: "Last seen at", value: "lastSeenAt" },
      { label: "Browser", value: "browser" },
      { label: "Browser version", value: "browserVersion" },
      { label: "Browser language", value: "browserLanguage" },
      { label: "Operating system", value: "os" },
      { label: "Country", value: "country" },
      { label: "Region", value: "region" },
      { label: "City", value: "city" },
      { label: "Title", value: "title" },
      { label: "Website url", value: "websiteUrl" },
      { label: "Company name", value: "companyName" },
      { label: "Industry", value: "industry" },
      { label: "Intercom ID", value: "intercomId" },
      { label: "External ID", value: "externalId" },
    ];
  }
  public setAttribute(attribute: string) {
    this.attribute = attribute;
    return this;
  }
  public setExpected(expected: any) {
    this.expected = expected;
    return this;
  }
  get table() {
    return "ProductUser";
  }
  toString() {
    let label = `Attribute`;
    if (this.attribute) {
      label += `.${this.attribute}`;
    }
    if (this.comparator) {
      label += `.${this.comparator?.toString()}.${this.expected}`;
    }
    return label;
  }
}

export default AttributeFilterNode;
