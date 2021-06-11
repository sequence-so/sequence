import { expect } from "chai";
import ProductUser from "src/models/productUser.model";
import userSeed from "tests/seeds/user.seed";

describe("product user", () => {
  it("should validate existence of email or externalId", async () => {
    const user = await userSeed();
    const productUserWithEmail = await ProductUser.create({
      email: "test@email.com",
      userId: user.id,
    });
    expect(productUserWithEmail).to.exist;
    expect(productUserWithEmail.id).to.not.be.null;
    expect(productUserWithEmail.email).to.eq("test@email.com");
    expect(productUserWithEmail.externalId).to.be.null;

    const productUserWithExternalId = await ProductUser.create({
      externalId: "abcdef",
      userId: user.id,
    });
    expect(productUserWithExternalId).to.exist;
    expect(productUserWithExternalId.id).to.not.be.null;
    expect(productUserWithExternalId.externalId).to.eq("abcdef");
    expect(productUserWithExternalId.email).to.be.null;

    expect(
      ProductUser.create({
        userId: user.id,
      })
    ).to.eventually.be.rejectedWith("Both email and externalId cannot be null");
  });
});
