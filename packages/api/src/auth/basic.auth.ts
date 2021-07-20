import SequenceError, { HTTP_UNAUTHORIZED } from "src/error/sequenceError";
import SequenceWebhook from "src/models/sequenceWebhook.model";

/**
 * Basic Authentication provides access to GraphQL resources using a
 * fixed API key.
 *
 * Expected header is a "Authorization: Bearer {base64 encoded token}",
 * where the token comes from the SequenceWebhook.token value.
 *
 */
export const basicAuthentication = async (tokenHeader: string) => {
  const passwordString = tokenHeader.split("Basic ")[1];
  const parsedString = Buffer.from(passwordString, "base64").toString("utf8");
  const finalToken = parsedString.substr(0, parsedString.length - 1);

  // perform database request for token here
  const token = await SequenceWebhook.findOne({
    where: {
      token: finalToken,
    },
    include: "user",
  });

  if (!token || !token.user) {
    throw new SequenceError(
      "You are not authorized to perform this request.",
      HTTP_UNAUTHORIZED
    );
  }

  return { token, user: token.user };
};
