export interface SendEmailPayload {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

abstract class AbstractEmailProvider {
  name: string;
  abstract send(payload: SendEmailPayload): Promise<any>;
}

export default AbstractEmailProvider;
