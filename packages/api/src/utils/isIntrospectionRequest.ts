import { Request } from "express";
const REGEX_INTROSPECTION_QUERY = /\b(__schema|__type)\b/;

/**
 * Identify if the request is an introspection query type
 * @param request {GraphQLRequestContext['request]}
 */
export const isIntrospectionRequest = (request: Request) => {
  return (
    typeof request.body.query === "string" &&
    REGEX_INTROSPECTION_QUERY.test(request.body.query)
  );
};
