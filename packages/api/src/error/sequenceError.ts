import { ApolloError } from "apollo-server-express";

export const HTTP_UNAUTHORIZED = 401;
export const FORBIDDEN_ERROR = 403;
export const MODEL_NOT_FOUND = 404;
export const INTERNAL_API_ERROR = 500;

class SequenceError extends ApolloError {
  statusCode: number;
  payload: Record<string, any>;
  errors?: any[];
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.payload = {
      success: false,
      message,
    };
    Object.defineProperty(this, "name", { value: "SequenceError" });
    Object.defineProperty(this, "payload", { value: this.payload });
    Object.defineProperty(this, "statusCode", { value: this.statusCode });
    Object.defineProperty(this, "errors", { value: this.errors });
  }
  setPayload(payload: Record<string, any>) {
    this.payload = payload;
  }
}

export default SequenceError;
