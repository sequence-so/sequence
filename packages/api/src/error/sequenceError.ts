class SequenceError extends Error {
  statusCode: number;
  payload: Record<string, any>;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.payload = {
      success: false,
      message,
    };
  }
  setPayload(payload: Record<string, any>) {
    this.payload = payload;
  }
}

export default SequenceError;
