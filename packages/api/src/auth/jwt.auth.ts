import { Request } from "express";
import { isIntrospectionRequest } from "src/utils/isIntrospectionRequest";
import jsonwebtoken from "jsonwebtoken";
import SequenceError, { HTTP_UNAUTHORIZED } from "src/error/sequenceError";
import JwtConfig from "src/config/jwt";

/**
 *
 * @param tokenHeader Request Authorization header
 * @param req Express request
 */
export const jwt = (tokenHeader: string, req: Request) => {
  if (isIntrospectionRequest(req)) {
    if (
      tokenHeader === "INTROSPECTION" &&
      process.env.NODE_ENV !== "production"
    ) {
      return { user: { firstName: "Admin" } };
    } else {
      throw new SequenceError(
        "You are not authorized to perform this request.",
        HTTP_UNAUTHORIZED
      );
    }
  }
  // normal JWT verification
  const token = tokenHeader.split("Bearer ")[1];
  try {
    const result = jsonwebtoken.verify(token, JwtConfig.jwt.secret);
    if (result) {
      return (result as any).user;
    }
  } catch (error) {
    throw new SequenceError(
      "You are not authorized to perform this request.",
      HTTP_UNAUTHORIZED
    );
  }
};
